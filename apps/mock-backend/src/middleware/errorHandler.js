export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
  
    res.status(status).json({
      status,
      message,
      details: err.details || undefined,
      timestamp: new Date().toISOString()
    });
  };