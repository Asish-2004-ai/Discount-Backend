function roundCurrency(amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
}
module.exports = { roundCurrency };
