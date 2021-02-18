// Members permissions middleware for the room
export default (req, res, next) => {
  const { roomId } = req.params;
  console.info(req.user);
  if (req.user.roomId && req.user.roomId.toString() === roomId) return next();

  return res.status(401).send("you got no permissions");
};
