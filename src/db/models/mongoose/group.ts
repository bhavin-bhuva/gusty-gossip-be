import mongoose from 'mongoose';

export interface IGroups extends mongoose.Document {
  name: mongoose.Schema.Types.ObjectId;
  conversation: mongoose.Schema.Types.ObjectId;
  admins: [mongoose.Schema.Types.ObjectId];
  creator: mongoose.Schema.Types.ObjectId;
  isArchived: Boolean;
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
    name: { type: String, required: true },
    discription: { type: String, required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    isArchived: { type: Boolean },
  },
  { timestamps: true }
);

const Groups: mongoose.Model<IGroups> = mongoose.models.Groups || mongoose.model<IGroups>('Group', GroupsSchema);

export default Groups;
