export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type JobType = 'merge' | 'split' | 'compress' | 'rotate' | 'convert' | 'edit';

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

export interface JobCreateResponse {
  success: boolean;
  message: string;
  data: Job;
}

export interface JobStatusResponse {
  success: boolean;
  data: Job;
}
