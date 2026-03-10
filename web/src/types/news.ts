export interface NewsArticle {
  _id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  tag: string;
  tagColor: string;
  readTime: number;
  featured: boolean;
  published: boolean;
  views: number;
  slug: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNews {
  articles: NewsArticle[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export const TAG_COLORS: Record<string, string> = {
  AI:           '#7C3AED',
  Security:     '#DC2626',
  Cloud:        '#2563EB',
  Tools:        '#059669',
  Web:          '#D97706',
  Mobile:       '#DB2777',
  'Open Source':'#0891B2',
  Startups:     '#EA580C',
  General:      '#6B7280',
};
