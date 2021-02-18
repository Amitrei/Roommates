export default class NotFoundError extends Error {
  constructor(modelName) {
    const message = `couldnt find ${modelName} ..`;
    super(message);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
