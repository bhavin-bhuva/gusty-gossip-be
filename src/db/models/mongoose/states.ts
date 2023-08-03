import mongoose from 'mongoose';

export interface IStates extends mongoose.Document {
  name: string;
  code?: string;
  latitude: string;
  longitude: string;
}

let Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * States schema for mangoose
 * @type {Schema}
 */

let StatesSchema = new Schema(
  {
    name: { type: String },
    code: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    countryId: { type: ObjectId, ref: 'Countries' },
  },
  { timestamps: true }
);

const States: mongoose.Model<IStates> = mongoose.models.States || mongoose.model<IStates>('States', StatesSchema);

export default States;
