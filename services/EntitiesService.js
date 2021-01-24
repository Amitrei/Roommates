import NotFoundError from "./../errors/NotFound.js";
import NoSuchProperty from "./../errors/NoSuchProperty.js";

export default class EntitiesService {
  constructor(model) {
    this.model = model;
    this.modelName = this.model.modelName;
  }

  create = async (model) => {
    return await this.model.create(model);
  };

  findOne = async (query) => {
    const model = await this.model.findOne(query);
    if (!model) throw new NotFoundError(this.modelName);
    return model;
  };

  find = async (query) => {
    return await this.model.find(query);
  };

  findById = async (id) => {
    const model = await this.model.findById(id);
    if (!model) throw new NotFoundError(this.modelName);
    return model;
  };

  findAll = async () => {
    return await this.model.find();
  };

  deleteById = async (id) => {
    const deletedModel = await this.model.findByIdAndDelete(id);
    if (!deletedModel) throw new NotFoundError(this.modelName);
    return deletedModel;
  };

  deleteByQuery = async (query) => {
    const deletedModel = await this.model.deleteOne(query);
    if (!deletedModel) throw new NotFoundError(this.modelName);
    return deletedModel;
  };

  updateById = async (id, updateRequest) => {
    const model = await this.findById(id);
    if (!model) throw new NotFoundError(this.modelName);

    for (const property in updateRequest) {
      if (!(property in model)) throw new NoSuchProperty(this.modelName, property);
      model[property] = updateRequest[property];
    }

    return await model.save();
  };

  update = async (model, updateRequest) => {
    for (const property in updateRequest) {
      if (!(property in model)) throw new NoSuchProperty(this.modelName, property);
      model[property] = updateRequest[property];
    }

    return await model.save();
  };
}
