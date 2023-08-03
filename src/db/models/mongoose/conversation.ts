import mongoose from 'mongoose';

export interface IConversations extends mongoose.Document {
  type: string;
  participants: [mongoose.Schema.Types.ObjectId];
  lastMessage: {
    from: string;
    content: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

let Schema = mongoose.Schema;
/**
 * Conversations schema for mangoose
 * @type {Schema}
 */
let ConversationsSchema = new Schema(
  {
    type: { type: String, required: true }, // "private" or "group"
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    lastMessage: {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, required: true },
      createdAt: { type: Date, required: true },
    },
  },
  { timestamps: true }
);

const Conversations: mongoose.Model<IConversations> =
  mongoose.models.Conversations || mongoose.model<IConversations>('Conversation', ConversationsSchema);

export default Conversations;
