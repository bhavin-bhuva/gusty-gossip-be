import mongoose from 'mongoose';

export interface IGroups extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  group: mongoose.Schema.Types.ObjectId;
  notification: Boolean;
  createdAt: string;
  updatedAt: string;
}

let Schema = mongoose.Schema;
/**
 * Groups schema for mangoose
 * @type {Schema}
 */
let GroupsSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    notification: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Groups: mongoose.Model<IGroups> = mongoose.models.Groups || mongoose.model<IGroups>('Group', GroupsSchema);

export default Groups;
