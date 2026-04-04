// intervention/alertSystem.js

const generateAdvice = require("../../../llm/adviceGenerator");

const triggerAlert = async (risk, data) => {
  let alert = {
    type: risk,
    message: ""
  };

  if (risk === "SAFE") {
    alert.message = "✅ You're spending within limits. Keep it up!";
  }

  if (risk === "WARNING") {
    alert.message = await generateAdvice(data);
  }

  if (risk === "HIGH") {
    alert.message = await generateAdvice(data);
    alert.block = true; // frontend can show popup
  }

  return alert;
};

module.exports = triggerAlert;