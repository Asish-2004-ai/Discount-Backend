const express = require('express');
const discountRouter = require('./routes/discount');

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'discount-rule-engine' });
});

app.use('/api/discount', discountRouter);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Discount Rule Engine listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
