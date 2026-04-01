const logs = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.originalUrl;

  console.log(`[${timestamp}] ${method} ${path}`);
  next();
};

module.exports = logs;
