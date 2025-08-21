const { roundCurrency } = require('../utils/money');

const RULES = [
  {
    name: 'NEW_CUSTOMER_10_PERCENT',
    priority: 1, 
    isApplicable: (order) => (order.customerType === 'NEW'),
    computeDiscount: (order) => roundCurrency(order.orderTotal * 0.10),
  },
  {
    name: 'BIG_ORDER_FLAT_500',
    priority: 2,
    isApplicable: (order) => Number(order.orderTotal) > 10000,
    computeDiscount: (_order) => 500,
  },
  {
    name: 'WEDNESDAY_5_PERCENT',
    priority: 3,
    isApplicable: (order) => order.dayOfWeek === 'WEDNESDAY',
    computeDiscount: (order) => roundCurrency(order.orderTotal * 0.05),
  },
];

module.exports = { RULES };
