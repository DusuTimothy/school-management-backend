const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const timestamp = new Date().toISOString();
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
