const { roundCurrency } = require('../utils/money');

class RuleEngine {
  constructor(rules = []) {
    this.rules = Array.from(rules).sort((a, b) => a.priority - b.priority);
  }

  evaluate(order) {
    const applicable = this.rules.filter(rule => {
      try { return !!rule.isApplicable(order); } catch { return false; }
    });

    if (applicable.length === 0) {
      const payable = roundCurrency(order.orderTotal);
      return { appliedRule: null, discount: 0, payable };
    }

    const selected = applicable[0];
    const rawDiscount = Number(selected.computeDiscount(order) || 0);
    const discount = roundCurrency(Math.max(0, rawDiscount));
    const payable = roundCurrency(Math.max(0, order.orderTotal - discount));

    return {
      appliedRule: selected.name,
      discount,
      payable
    };
  }
}

module.exports = { RuleEngine };
