export const getUser = async (req, res) => {
  const { user } = req;
  res.json(user.token);
};
