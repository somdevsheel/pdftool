import { IconSpec } from '../components/common/Icon';

export interface Tool {
  id: string;
  name: string;
  desc: string;
  icon: IconSpec;
  color: string;
  category: string;
  endpoint: string;
  inputType: 'pdf' | 'image' | 'multi-pdf' | 'multi-image';
  outputExt: string;
  disabled?: boolean;
  // Which screen ToolCard navigates to. Defaults to 'ToolScreen' (the generic
  // upload → process → download flow) when omitted; local-only tools like the
  // PDF Viewer point elsewhere.
  screen?: string;
}

export interface JobStatus {
  id: string;
  type: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  progress: number;
  error?: string;
  outputPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: string;
}
