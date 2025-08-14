const { Op } = require('sequelize');
const Sale = require('../models/Sale');
const Payment = require('../models/Payment');
const Shift = require('../models/Shift');

class AIFraudDetectionService {
  constructor() {
    this.fraudThresholds = {
      highDiscountPercentage: 25, // Alert if discount > 25%
      highReturnFrequency: 0.3,   // Alert if returns > 30% of sales
      cashMismatchThreshold: 100, // Alert if cash mismatch > ₹100
      unusualTransactionAmount: 50000, // Alert if transaction > ₹50,000
      rapidTransactions: 10,       // Alert if > 10 transactions in 5 minutes
      timeWindow: 5 * 60 * 1000   // 5 minutes in milliseconds
    };
  }

  /**
   * Analyze a transaction for potential fraud
   * @param {Object} transaction - Transaction data
   * @param {Object} context - Additional context (cashier, shift, etc.)
   * @returns {Object} Fraud analysis results
   */
  async analyzeTransaction(transaction, context = {}) {
    const analysis = {
      riskScore: 0,
      alerts: [],
      recommendations: [],
      isHighRisk: false
    };

    try {
      // 1. Discount Analysis
      const discountAnalysis = await this.analyzeDiscounts(transaction, context);
      analysis.alerts.push(...discountAnalysis.alerts);
      analysis.riskScore += discountAnalysis.riskScore;

      // 2. Cash Mismatch Analysis
      const cashAnalysis = await this.analyzeCashMismatch(transaction, context);
      analysis.alerts.push(...cashAnalysis.alerts);
      analysis.riskScore += cashAnalysis.riskScore;

      // 3. Transaction Pattern Analysis
      const patternAnalysis = await this.analyzeTransactionPatterns(transaction, context);
      analysis.alerts.push(...patternAnalysis.alerts);
      analysis.riskScore += patternAnalysis.riskScore;

      // 4. Amount Anomaly Detection
      const amountAnalysis = await this.analyzeAmountAnomalies(transaction, context);
      analysis.alerts.push(...amountAnalysis.alerts);
      analysis.riskScore += amountAnalysis.riskScore;

      // 5. Time-based Analysis
      const timeAnalysis = await this.analyzeTimePatterns(transaction, context);
      analysis.alerts.push(...timeAnalysis.alerts);
      analysis.riskScore += timeAnalysis.riskScore;

      // Determine overall risk level
      analysis.isHighRisk = analysis.riskScore >= 70;
      
      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      return analysis;

    } catch (error) {
      console.error('Error in fraud analysis:', error);
      return {
        riskScore: 0,
        alerts: ['Error occurred during fraud analysis'],
        recommendations: ['Please review transaction manually'],
        isHighRisk: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze discount patterns for potential abuse
   */
  async analyzeDiscounts(transaction, context) {
    const result = { alerts: [], riskScore: 0 };
    
    if (!transaction.discountAmount || transaction.discountAmount <= 0) {
      return result;
    }

    const discountPercentage = (transaction.discountAmount / transaction.subtotal) * 100;
    
    if (discountPercentage > this.fraudThresholds.highDiscountPercentage) {
      result.alerts.push({
        type: 'HIGH_DISCOUNT',
        severity: 'WARNING',
        message: `High discount detected: ${discountPercentage.toFixed(2)}%`,
        details: {
          discountAmount: transaction.discountAmount,
          subtotal: transaction.subtotal,
          percentage: discountPercentage
        }
      });
      result.riskScore += 20;
    }

    // Check if cashier has history of high discounts
    if (context.cashierId) {
      const cashierDiscountHistory = await this.getCashierDiscountHistory(context.cashierId);
      const averageDiscount = cashierDiscountHistory.averageDiscount;
      
      if (discountPercentage > averageDiscount * 2) {
        result.alerts.push({
          type: 'UNUSUAL_DISCOUNT',
          severity: 'MEDIUM',
          message: 'Discount significantly higher than cashier average',
          details: {
            currentDiscount: discountPercentage,
            averageDiscount: averageDiscount
          }
        });
        result.riskScore += 15;
      }
    }

    return result;
  }

  /**
   * Analyze cash transactions for mismatches
   */
  async analyzeCashMismatch(transaction, context) {
    const result = { alerts: [], riskScore: 0 };
    
    if (transaction.paymentMethod !== 'cash') {
      return result;
    }

    const cashMismatch = Math.abs(transaction.receivedAmount - transaction.totalAmount);
    
    if (cashMismatch > this.fraudThresholds.cashMismatchThreshold) {
      result.alerts.push({
        type: 'CASH_MISMATCH',
        severity: 'HIGH',
        message: `Large cash mismatch detected: ₹${cashMismatch}`,
        details: {
          receivedAmount: transaction.receivedAmount,
          totalAmount: transaction.totalAmount,
          mismatch: cashMismatch
        }
      });
      result.riskScore += 30;
    }

    // Check if change amount is suspicious
    if (transaction.changeAmount > transaction.totalAmount * 0.5) {
      result.alerts.push({
        type: 'SUSPICIOUS_CHANGE',
        severity: 'MEDIUM',
        message: 'Unusually large change amount',
        details: {
          changeAmount: transaction.changeAmount,
          totalAmount: transaction.totalAmount
        }
      });
      result.riskScore += 10;
    }

    return result;
  }

  /**
   * Analyze transaction patterns for anomalies
   */
  async analyzeTransactionPatterns(transaction, context) {
    const result = { alerts: [], riskScore: 0 };
    
    if (!context.cashierId) {
      return result;
    }

    // Check for rapid transactions
    const recentTransactions = await this.getRecentTransactions(context.cashierId, this.fraudThresholds.timeWindow);
    
    if (recentTransactions.length > this.fraudThresholds.rapidTransactions) {
      result.alerts.push({
        type: 'RAPID_TRANSACTIONS',
        severity: 'MEDIUM',
        message: `High transaction frequency: ${recentTransactions.length} transactions in ${this.fraudThresholds.timeWindow / 60000} minutes`,
        details: {
          transactionCount: recentTransactions.length,
          timeWindow: this.fraudThresholds.timeWindow / 60000
        }
      });
      result.riskScore += 15;
    }

    // Check for unusual transaction amounts
    if (transaction.totalAmount > this.fraudThresholds.unusualTransactionAmount) {
      result.alerts.push({
        type: 'UNUSUAL_AMOUNT',
        severity: 'MEDIUM',
        message: `Unusually high transaction amount: ₹${transaction.totalAmount}`,
        details: {
          amount: transaction.totalAmount,
          threshold: this.fraudThresholds.unusualTransactionAmount
        }
      });
      result.riskScore += 10;
    }

    return result;
  }

  /**
   * Analyze amount anomalies
   */
  async analyzeAmountAnomalies(transaction, context) {
    const result = { alerts: [], riskScore: 0 };
    
    // Check for round numbers (potential manual entry)
    if (this.isRoundNumber(transaction.totalAmount)) {
      result.alerts.push({
        type: 'ROUND_AMOUNT',
        severity: 'LOW',
        message: 'Transaction amount is a round number',
        details: {
          amount: transaction.totalAmount
        }
      });
      result.riskScore += 5;
    }

    // Check for amounts just below reporting thresholds
    if (transaction.totalAmount >= 9999 && transaction.totalAmount < 10000) {
      result.alerts.push({
        type: 'THRESHOLD_AVOIDANCE',
        severity: 'MEDIUM',
        message: 'Transaction amount just below ₹10,000 threshold',
        details: {
          amount: transaction.totalAmount,
          threshold: 10000
        }
      });
      result.riskScore += 15;
    }

    return result;
  }

  /**
   * Analyze time-based patterns
   */
  async analyzeTimePatterns(transaction, context) {
    const result = { alerts: [], riskScore: 0 };
    
    const transactionTime = new Date(transaction.saleDate);
    const hour = transactionTime.getHours();
    
    // Check for transactions outside business hours
    if (hour < 6 || hour > 23) {
      result.alerts.push({
        type: 'OFF_HOURS_TRANSACTION',
        severity: 'MEDIUM',
        message: 'Transaction outside normal business hours',
        details: {
          time: transactionTime.toLocaleTimeString(),
          hour: hour
        }
      });
      result.riskScore += 10;
    }

    // Check for transactions on unusual days
    const dayOfWeek = transactionTime.getDay();
    if (dayOfWeek === 0) { // Sunday
      result.alerts.push({
        type: 'SUNDAY_TRANSACTION',
        severity: 'LOW',
        message: 'Transaction on Sunday',
        details: {
          day: 'Sunday',
          date: transactionTime.toLocaleDateString()
        }
      });
      result.riskScore += 5;
    }

    return result;
  }

  /**
   * Get cashier's discount history
   */
  async getCashierDiscountHistory(cashierId) {
    const sales = await Sale.findAll({
      where: {
        cashierId: cashierId,
        discountAmount: { [Op.gt]: 0 },
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      attributes: ['discountAmount', 'subtotal']
    });

    if (sales.length === 0) {
      return { averageDiscount: 0, totalDiscounts: 0 };
    }

    const totalDiscounts = sales.length;
    const averageDiscount = sales.reduce((sum, sale) => {
      return sum + ((sale.discountAmount / sale.subtotal) * 100);
    }, 0) / totalDiscounts;

    return { averageDiscount, totalDiscounts };
  }

  /**
   * Get recent transactions for a cashier
   */
  async getRecentTransactions(cashierId, timeWindow) {
    return await Sale.findAll({
      where: {
        cashierId: cashierId,
        createdAt: {
          [Op.gte]: new Date(Date.now() - timeWindow)
        }
      },
      attributes: ['id', 'totalAmount', 'createdAt']
    });
  }

  /**
   * Check if a number is round
   */
  isRoundNumber(amount) {
    return amount % 100 === 0 || amount % 1000 === 0;
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.riskScore >= 70) {
      recommendations.push('Immediate manual review required');
      recommendations.push('Consider suspending cashier access temporarily');
    } else if (analysis.riskScore >= 50) {
      recommendations.push('Enhanced monitoring recommended');
      recommendations.push('Review cashier performance metrics');
    } else if (analysis.riskScore >= 30) {
      recommendations.push('Continue monitoring');
      recommendations.push('Provide additional training if patterns persist');
    }

    // Specific recommendations based on alert types
    const alertTypes = analysis.alerts.map(alert => alert.type);
    
    if (alertTypes.includes('HIGH_DISCOUNT')) {
      recommendations.push('Review discount policies and cashier training');
    }
    
    if (alertTypes.includes('CASH_MISMATCH')) {
      recommendations.push('Implement cash counting procedures');
      recommendations.push('Consider dual cashier verification for large amounts');
    }
    
    if (alertTypes.includes('RAPID_TRANSACTIONS')) {
      recommendations.push('Monitor cashier efficiency and customer satisfaction');
    }

    return recommendations;
  }

  /**
   * Generate fraud detection report
   */
  async generateFraudReport(startDate, endDate, options = {}) {
    const report = {
      period: { startDate, endDate },
      summary: {},
      highRiskTransactions: [],
      cashierRiskAnalysis: [],
      recommendations: []
    };

    try {
      // Get all transactions in the period
      const transactions = await Sale.findAll({
        where: {
          saleDate: {
            [Op.between]: [startDate, endDate]
          },
          status: 'completed'
        },
        include: [
          { model: require('../models/User'), as: 'cashier', attributes: ['id', 'name'] }
        ]
      });

      // Analyze each transaction
      const analysisResults = [];
      for (const transaction of transactions) {
        const analysis = await this.analyzeTransaction(transaction, {
          cashierId: transaction.cashierId
        });
        
        if (analysis.isHighRisk) {
          report.highRiskTransactions.push({
            transaction: transaction,
            analysis: analysis
          });
        }
        
        analysisResults.push(analysis);
      }

      // Generate summary statistics
      report.summary = {
        totalTransactions: transactions.length,
        highRiskTransactions: report.highRiskTransactions.length,
        averageRiskScore: analysisResults.reduce((sum, result) => sum + result.riskScore, 0) / analysisResults.length,
        totalAlerts: analysisResults.reduce((sum, result) => sum + result.alerts.length, 0)
      };

      // Generate cashier risk analysis
      report.cashierRiskAnalysis = await this.generateCashierRiskAnalysis(transactions, analysisResults);

      // Generate overall recommendations
      report.recommendations = this.generateOverallRecommendations(report);

      return report;

    } catch (error) {
      console.error('Error generating fraud report:', error);
      throw error;
    }
  }

  /**
   * Generate cashier-specific risk analysis
   */
  async generateCashierRiskAnalysis(transactions, analysisResults) {
    const cashierAnalysis = {};
    
    transactions.forEach((transaction, index) => {
      const cashierId = transaction.cashierId;
      const analysis = analysisResults[index];
      
      if (!cashierAnalysis[cashierId]) {
        cashierAnalysis[cashierId] = {
          cashierId: cashierId,
          cashierName: transaction.cashier?.name || 'Unknown',
          totalTransactions: 0,
          totalRiskScore: 0,
          alerts: [],
          riskLevel: 'LOW'
        };
      }
      
      cashierAnalysis[cashierId].totalTransactions++;
      cashierAnalysis[cashierId].totalRiskScore += analysis.riskScore;
      cashierAnalysis[cashierId].alerts.push(...analysis.alerts);
    });

    // Calculate risk levels for each cashier
    Object.values(cashierAnalysis).forEach(cashier => {
      const averageRisk = cashier.totalRiskScore / cashier.totalTransactions;
      
      if (averageRisk >= 70) {
        cashier.riskLevel = 'HIGH';
      } else if (averageRisk >= 50) {
        cashier.riskLevel = 'MEDIUM';
      } else {
        cashier.riskLevel = 'LOW';
      }
    });

    return Object.values(cashierAnalysis);
  }

  /**
   * Generate overall recommendations
   */
  generateOverallRecommendations(report) {
    const recommendations = [];

    if (report.summary.highRiskTransactions > 0) {
      recommendations.push('Implement enhanced monitoring for high-risk transactions');
      recommendations.push('Review and update fraud detection thresholds');
    }

    if (report.summary.averageRiskScore > 50) {
      recommendations.push('Conduct comprehensive cashier training on fraud prevention');
      recommendations.push('Review and strengthen internal controls');
    }

    const highRiskCashiers = report.cashierRiskAnalysis.filter(cashier => cashier.riskLevel === 'HIGH');
    if (highRiskCashiers.length > 0) {
      recommendations.push(`Provide additional training for ${highRiskCashiers.length} high-risk cashiers`);
      recommendations.push('Consider implementing dual verification for high-risk cashiers');
    }

    return recommendations;
  }
}

module.exports = new AIFraudDetectionService();
