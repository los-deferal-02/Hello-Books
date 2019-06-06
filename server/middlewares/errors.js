/**
  *  Error Handling Middleware
  * @param {object} err
  * @param {object} req
  * @param {object} res
  * @param {function} next
  * @returns {object} Containing Error Message
  */
const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: err.message
  });
};

/**
  * Error Handler for unknown routes
  * @param {object} req
  * @param {object} res
  * @returns {object} Containing Error Message
  */
const error404 = (req, res) => {
  res.status(404).json({
    message: 'Oops!! Page not found'
  });
};

export { errorHandler, error404 };
