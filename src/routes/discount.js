const express = require('express');
const Joi = require('joi');
const { RuleEngine } = require('../engine/RuleEngine');
const { RULES } = require('../rules/rules');
const { roundCurrency } = require('../utils/money');

const router = express.Router();

const schema = Joi.object({
  customerType: Joi.string().valid('NEW', 'REGULAR', 'PREMIUM').required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      category: Joi.string().required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  orderTotal: Joi.number().min(0).required(),
  dayOfWeek: Joi.string().valid(
    'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'
  ).required()
});

router.get('/', (_req, res) => {
  res.json({ availableRules: RULES.map(r => r.name) });
});

router.post('/', (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: 'ValidationError', details: error.details.map(d => d.message) });
  }

  const { customerType, items, orderTotal, dayOfWeek } = value;

  const computedTotal = roundCurrency(items.reduce((sum, it) => sum + Number(it.price), 0));
  const normalizedOrder = {
    customerType,
    items,
    orderTotal: computedTotal,
    dayOfWeek
  };

  const engine = new RuleEngine(RULES);
  const result = engine.evaluate(normalizedOrder);

  return res.json({
    input: normalizedOrder,
    result
  });
});

module.exports = router;
