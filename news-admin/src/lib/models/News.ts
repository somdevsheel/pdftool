import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  tag: string;
  tagColor: string;
  imageUrl: string;
  imageKey: string;
  source: string;
  sourceUrl: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  views: number;
  contentType: 'news' | 'blog';
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    summary: { type: String, required: true, maxlength: 500 },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    tagColor: { type: String, required: true },
    imageUrl: { type: String, required: true },
    imageKey: { type: String, required: true },
    source: { type: String, required: true },
    sourceUrl: { type: String, default: '' },
    readTime: { type: Number, default: 3 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    contentType: { type: String, enum: ['news', 'blog'], default: 'news' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

NewsSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title) + '-' + Date.now();
  }
  next();
});

NewsSchema.index({ published: 1, createdAt: -1 });
NewsSchema.index({ tag: 1, published: 1 });
NewsSchema.index({ featured: 1, published: 1 });
NewsSchema.index({ contentType: 1, published: 1 });

export const News = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);