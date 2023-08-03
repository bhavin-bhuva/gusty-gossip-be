import type { ICities } from '../models/mongoose/cities';
import { BaseRepository } from './base';
import CitiesSchema from '../models/mongoose/cities';

export default class CitiesRepository extends BaseRepository<ICities> {
  constructor() {
    super(CitiesSchema);
  }
  async fetchCities<ICities>(cond, fields, options, page, limit): Promise<ICities | null> {
    return (await this._model
      .find(cond, fields, options)
      .select({ name: true })
      .limit(limit * 1)
      .skip((page - 1) * limit)) as unknown as ICities;
  }
}
