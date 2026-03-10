// import mongoose, { Schema, Document } from 'mongoose';

// export interface ISubscriber extends Document {
//   email: string;
//   subscribedAt: Date;
//   active: boolean;
//   source: 'popup' | 'sidebar' | 'footer';
// }

// const SubscriberSchema = new Schema<ISubscriber>(
//   {
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     active: { type: Boolean, default: true },
//     source: { type: String, enum: ['popup', 'sidebar', 'footer'], default: 'sidebar' },
//   },
//   { timestamps: true }
// );

// export const Subscriber =
//   mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);





import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface ISubscriber extends Document {
  email: string;
  active: boolean;
  source: 'popup' | 'sidebar' | 'footer';
  unsubscribeToken: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    active: { type: Boolean, default: true },
    source: { type: String, enum: ['popup', 'sidebar', 'footer'], default: 'sidebar' },
    unsubscribeToken: {
      type: String,
      default: () => crypto.randomBytes(32).toString('hex'),
      unique: true,
    },
  },
  { timestamps: true }
);

export const Subscriber =
  mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);