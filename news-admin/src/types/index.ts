export interface NewsArticle {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export interface PaginatedNews {
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type NewsTag = 'AI' | 'Security' | 'Cloud' | 'Tools' | 'Web' | 'Mobile' | 'Open Source' | 'Startups';

export const TAG_COLORS: Record<NewsTag, string> = {
  'AI': '#6B7FD7',
  'Security': '#E8526A',
  'Cloud': '#3FC87A',
  'Tools': '#F5A623',
  'Web': '#C17EE8',
  'Mobile': '#5BB8F5',
  'Open Source': '#3FC87A',
  'Startups': '#E87CF3',
};
