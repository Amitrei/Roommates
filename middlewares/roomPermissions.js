export default (req, res, next) => {
  const { roomId } = req.params;
  if (req.user.roomId && req.user.roomId.equals(roomId)) return next();

  return res.status(401).send("you got no permissions");
};
