import NotFoundError from "./../errors/NotFound.js";
import NoSuchProperty from "./../errors/NoSuchProperty.js";
import BadRequest from "./../errors/BadRequest.js";

export default (err, req, res, next) => {
  if (err instanceof NotFoundError || NoSuchProperty || BadRequest)
    return res.status(400).send(err.message);

  res.status(500).send("something went wrong...");
};
