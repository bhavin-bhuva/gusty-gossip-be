import mongoose from 'mongoose';

export interface IMessages extends mongoose.Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  from: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: string;
  updatedAt: string;
}

let Schema = mongoose.Schema;
/**
 * Messages schema for mangoose
 * @type {Schema}
 */
let MessagesSchema = new Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    reads: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Messages: mongoose.Model<IMessages> =
  mongoose.models.Messages || mongoose.model<IMessages>('Message', MessagesSchema);

export default Messages;
