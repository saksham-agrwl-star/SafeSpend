const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const Transaction = require('./models/Transaction');
    const txns = await Transaction.find({ amount: { $gt: 0 } });
    for (let tx of txns) {
      tx.amount = -tx.amount;
      await tx.save();
    }
    console.log('Fixed', txns.length, 'transactions');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
