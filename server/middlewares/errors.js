const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    status: res.statusCode,
    error: err.message
  })
};

const error404 =  (req, res)=> {
  res.status(404).json({
    message: 'Oops!!, the page you are looking for cannot be found'
  });
}