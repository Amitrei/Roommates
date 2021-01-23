export default class NoSuchProperty extends Error {
  constructor(modelName, property) {
    const message = `couldnt find "${property}" property in ${modelName}..`;
    super(message);
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}
