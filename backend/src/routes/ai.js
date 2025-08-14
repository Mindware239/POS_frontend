const express = require('express');
const router = express.Router();

// @route   POST /api/ai/fraud-detection
// @desc    Analyze transaction for fraud
// @access  Private (Admin/Manager)
router.post('/fraud-detection', async (req, res) => {
  try {
    const { transaction } = req.body;
    
    // Mock fraud detection logic (in real app, this would use ML models)
    const riskFactors = [];
    let riskScore = 0;
    
    // Check for high discount
    if (transaction.discount > transaction.total * 0.3) {
      riskFactors.push('High discount amount');
      riskScore += 25;
    }
    
    // Check for cash mismatch
    if (transaction.paymentMethod === 'cash' && 
        Math.abs(transaction.receivedAmount - transaction.total) > 1000) {
      riskFactors.push('Large cash difference');
      riskScore += 20;
    }
    
    // Check for rapid transactions
    if (transaction.timeSinceLastTransaction < 30) { // seconds
      riskFactors.push('Rapid successive transactions');
      riskScore += 15;
    }
    
    // Check for unusual amounts
    if (transaction.total > 10000) {
      riskFactors.push('Unusually high transaction amount');
      riskScore += 10;
    }
    
    // Check for off-hours transactions
    const hour = new Date(transaction.timestamp).getHours();
    if (hour < 6 || hour > 23) {
      riskFactors.push('Transaction outside business hours');
      riskScore += 10;
    }
    
    const analysis = {
      riskScore: Math.min(riskScore, 100),
      riskLevel: riskScore < 30 ? 'Low' : riskScore < 60 ? 'Medium' : 'High',
      riskFactors,
      recommendations: [],
      timestamp: new Date()
    };
    
    // Generate recommendations
    if (riskScore >= 60) {
      analysis.recommendations.push('Review transaction manually');
      analysis.recommendations.push('Verify customer identity');
      analysis.recommendations.push('Check for similar patterns');
    } else if (riskScore >= 30) {
      analysis.recommendations.push('Monitor for similar transactions');
      analysis.recommendations.push('Verify payment method');
    } else {
      analysis.recommendations.push('Transaction appears normal');
    }
    
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/ai/fraud-report
// @desc    Get fraud detection report
// @access  Private (Admin/Manager)
router.get('/fraud-report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Mock fraud report data
    const report = {
      period: {
        start: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: endDate || new Date()
      },
      summary: {
        totalTransactions: 150,
        flaggedTransactions: 12,
        highRiskTransactions: 3,
        averageRiskScore: 18.5
      },
      riskDistribution: {
        low: 120,
        medium: 15,
        high: 3
      },
      topRiskFactors: [
        { factor: 'High discount amount', count: 5 },
        { factor: 'Large cash difference', count: 3 },
        { factor: 'Rapid successive transactions', count: 2 }
      ],
      cashierRisk: [
        { cashierId: 'cashier-1', riskScore: 15, transactions: 45 },
        { cashierId: 'cashier-2', riskScore: 22, transactions: 38 }
      ]
    };
    
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/ai/auto-reconciliation
// @desc    Auto-reconcile bank transactions
// @access  Private (Admin/Manager)
router.post('/auto-reconciliation', async (req, res) => {
  try {
    const { bankTransactions, posTransactions } = req.body;
    
    // Mock auto-reconciliation logic
    const reconciliation = {
      totalBankTransactions: bankTransactions.length,
      totalPOSTransactions: posTransactions.length,
      matched: 0,
      unmatched: 0,
      suggestions: [],
      confidence: 0.85
    };
    
    // Simple matching logic (in real app, this would be more sophisticated)
    bankTransactions.forEach(bankTx => {
      const match = posTransactions.find(posTx => 
        Math.abs(bankTx.amount - posTx.total) < 1 &&
        Math.abs(new Date(bankTx.date) - new Date(posTx.date)) < 24 * 60 * 60 * 1000
      );
      
      if (match) {
        reconciliation.matched++;
      } else {
        reconciliation.unmatched++;
        reconciliation.suggestions.push({
          bankTransaction: bankTx,
          possibleMatches: posTransactions.filter(posTx => 
            Math.abs(bankTx.amount - posTx.total) < 10
          )
        });
      }
    });
    
    res.json(reconciliation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/ai/insights
// @desc    Get AI-powered business insights
// @access  Private (Admin/Manager)
router.get('/insights', async (req, res) => {
  try {
    const insights = {
      salesPredictions: {
        nextWeek: 95,
        nextMonth: 380,
        confidence: 0.78
      },
      inventoryRecommendations: [
        {
          product: 'Premium T-Shirt',
          action: 'restock',
          quantity: 25,
          reason: 'High demand trend detected'
        },
        {
          product: 'Wireless Headphones',
          action: 'reduce',
          quantity: 10,
          reason: 'Declining sales pattern'
        }
      ],
      customerInsights: [
        {
          segment: 'High-value customers',
          count: 45,
          averageOrder: 2500,
          recommendation: 'Implement loyalty program'
        },
        {
          segment: 'New customers',
          count: 23,
          averageOrder: 800,
          recommendation: 'Focus on retention strategies'
        }
      ],
      operationalInsights: [
        {
          type: 'peak_hours',
          insight: 'Sales peak between 2-6 PM',
          recommendation: 'Schedule more staff during peak hours'
        },
        {
          type: 'payment_trends',
          insight: 'UPI payments increased by 25%',
          recommendation: 'Promote digital payment options'
        }
      ]
    };
    
    res.json(insights);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
