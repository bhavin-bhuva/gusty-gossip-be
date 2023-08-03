import mongoose from 'mongoose';

export interface ICities extends mongoose.Document {
  name: string;
  latitude: string;
  longitude: string;
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * Cities schema for mangoose
 * @type {Schema}
 */

let CitiesSchema = new Schema(
  {
    name: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    stateId: { type: ObjectId, ref: 'States' },
  },
  { timestamps: true }
);

const Cities: mongoose.Model<ICities> = mongoose.models.ICities || mongoose.model<ICities>('Cities', CitiesSchema);

export default Cities;
