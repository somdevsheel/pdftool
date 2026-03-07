export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: UploadedFile;
}

export interface MultiUploadResponse {
  success: boolean;
  message: string;
  data: UploadedFile[];
}
