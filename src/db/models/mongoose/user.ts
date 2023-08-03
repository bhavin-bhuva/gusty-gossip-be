import mongoose, { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface ISubscription extends mongoose.Document {
  isSubscribed: boolean;
  planId?: Types.ObjectId;
  expire: Date;
}
export interface IUser extends mongoose.Document {
  email: string;
  isEmailVerified: boolean;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  photo?: string;
  createdAt?: number;
  updatedAt?: number;
  role: 'admin' | 'user';
  title?: string;
  lastActivity?: Date;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
  type: 'GOOGLE' | 'FACEBOOK' | 'CUSTOM';
  plan: string;
  subscription: ISubscription;
  customerId: string;
  renewAccount: boolean;
  newCollection: boolean;
  downloads: number;
  recentDownloadDate: Date;
  isArchived: boolean;
  status: string;
}

let Schema = mongoose.Schema;

//Validation match
// let phone_match = [/[\+0-9]+/, "No phone number found ({VALUE})"];
let emailMatch: [RegExp, string] = [/([a-z0-9_\-.])+@([a-z0-9_\-.])+\.([a-z0-9])+/i, 'No email found ({VALUE})'];
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * User schema for mangoose
 * @type {Schema}
 */

let UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    fullName: { type: String },
    email: {
      type: String,
      match: emailMatch,
      unique: [true, 'Email already exists'],
    },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String },
    photo: { type: String, default: null },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    title: {
      type: String,
    },
    lastActivity: {
      type: Date,
      default: new Date(),
    },
    zipCode: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    type: {
      type: String,
      enum: ['GOOGLE', 'FACEBOOK', 'CUSTOM'],
      default: 'CUSTOM',
    },
    plan: { type: String, default: 'basic' },
    subscription: {
      isSubscribed: {
        type: Boolean,
        default: false,
      },

      planId: {
        type: ObjectId,
        ref: 'Plan',
      },

      expire: {
        type: Date,
        default: null,
      },
    },
    customerId: { type: String },
    renewAccount: { type: Boolean, default: true },
    newCollection: { type: Boolean, default: true },
    downloads: { type: Number, default: 0 },
    recentDownloadDate: { type: Date, default: null },
    isArchived: { type: Boolean, default: false },
    status: { type: String, default: null },
  },
  { timestamps: true }
);

// Bcrypt middleware on UserSchema
UserSchema.pre('save', function (next) {
  var user: IUser = this as IUser;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    // console.log('user.password', user.password);

    if (user.password !== undefined) {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        return next();
      });
    }
  });
});

const User: mongoose.Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
