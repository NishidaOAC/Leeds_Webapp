const getYearEndExpiry = () => {
  const year = new Date().getFullYear();
  return new Date(`${year}-12-31T23:59:59`);
};

module.exports = { getYearEndExpiry };
