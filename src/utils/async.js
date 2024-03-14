const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ success: false, msg: error.message });
    }
  };
};

export default asyncHandler;
