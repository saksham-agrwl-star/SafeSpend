/**
 * Decides whether to allow, warn, or block the transaction
 * based on behavior risk and prediction outcomes.
 */
const makeDecision = (behaviorResult, predictionResult) => {
  const { riskScore } = behaviorResult;
  const { riskStatus } = predictionResult;

  let finalStatus = 'SAFE';

  if (riskStatus === 'Critical' || riskScore >= 80) {
    finalStatus = 'BLOCK';
  } else if (riskStatus === 'Warning' || riskScore >= 40) {
    finalStatus = 'WARNING';
  }

  return finalStatus;
};

module.exports = { makeDecision };
