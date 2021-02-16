import NotFoundError from "./../errors/NotFound.js";
import NoSuchProperty from "./../errors/NoSuchProperty.js";
import BadRequest from "./../errors/BadRequest.js";

export default (err, req, res, next) => {
  if (err instanceof NotFoundError || err instanceof NoSuchProperty || err instanceof BadRequest) {
    console.error(err);
    return res.status(400).send(err.message);
  }

  console.log(err);
  return res.status(400).send(err.message);
};
