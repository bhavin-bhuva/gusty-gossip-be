import mongoose from 'mongoose';

export interface ICountries extends mongoose.Document {
  name: string;
  code?: string;
  iso3?: string;
  iso2?: string;
  region?: string;
  currency?: string;
  currencySymbol?: string;
  latitude: string;
  longitude: string;
}

let Schema = mongoose.Schema;
/**
 * Countries schema for mangoose
 * @type {Schema}
 */

let CountriesSchema = new Schema(
  {
    name: { type: String },
    code: { type: String },
    iso3: { type: String },
    iso2: { type: String },
    region: { type: String },
    currency: { type: String },
    currencySymbol: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  { timestamps: true }
);

const Countries: mongoose.Model<ICountries> =
  mongoose.models.Countries || mongoose.model<ICountries>('Countries', CountriesSchema);

export default Countries;
