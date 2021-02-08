// Members permissions middleware for the room
export default (req, res, next) => {
  const { roomId } = req.params;
  if (req.user.roomId && req.user.roomId === roomId) return next();

  return res.status(401).send("you got no permissions");
};
