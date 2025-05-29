export const handleError = (err, res) => {
  console.error(err);

  return res.status(500).json({
    message: "An error occurred. Please try again later.",
    errorCode: "SERVER_ERROR",
  });
};
