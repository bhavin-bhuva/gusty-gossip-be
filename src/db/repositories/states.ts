import type { IStates } from '../models/mongoose/states';
import { BaseRepository } from './base';
import StatesSchema from '../models/mongoose/states';

export default class StatesRepository extends BaseRepository<IStates> {
  constructor() {
    super(StatesSchema);
  }
  async fetchStates<IStates>(cond, fields, options, page, limit): Promise<IStates | null> {
    return (await this._model
      .find(cond, fields, options)
      .select({ name: true })
      .limit(limit * 1)
      .skip((page - 1) * limit)) as unknown as IStates;
  }
}
