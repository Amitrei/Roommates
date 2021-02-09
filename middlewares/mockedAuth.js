export default (req, res, next) => {
  if (req && req.session && req.session.user_tmp) {
    req.user = req.session.user_tmp;
  }

  next();
};
