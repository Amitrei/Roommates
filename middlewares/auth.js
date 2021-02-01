export default (req, res, next) => {
  if (req.user) return next();
  res.status(401).send("please log in");
};
