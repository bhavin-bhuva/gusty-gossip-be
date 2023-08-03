import type { ICountries } from '../models/mongoose/countries';
import { BaseRepository } from './base';
import CountriesSchema from '../models/mongoose/countries';

export default class CountriesRepository extends BaseRepository<ICountries> {
  constructor() {
    super(CountriesSchema);
  }
  async fetchCountries<ICountries>(cond, fields, options, page, limit): Promise<ICountries | null> {
    return (await this._model
      .find(cond, fields, options)
      .select({ name: true })
      .limit(limit * 1)
      .skip((page - 1) * limit)) as unknown as ICountries;
  }
}
