export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type JobType = 'merge' | 'split' | 'compress' | 'rotate' | 'convert' | 'edit' | 'pages';
export type CompressQuality = 'low' | 'medium' | 'high';
export type PagesOperation = 'delete' | 'extract' | 'reorder' | 'organize';

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  inputFileIds: string[];
  outputFileId?: string;
  outputPath?: string;
  error?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface EditInstruction {
  type: 'text' | 'annotation' | 'rotate';
  page: number;
  x?: number;
  y?: number;
  content?: string;
  fontSize?: number;
  color?: string;
  degrees?: number;
  originalText?: string; 
}

export interface Tool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  acceptedMimeTypes: string[];
  maxFiles: number;
}
