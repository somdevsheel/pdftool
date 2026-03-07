export const QUEUE_NAMES = {
  PDF_PROCESSING: 'pdf-processing',
} as const;

export const JOB_TYPES = {
  MERGE: 'merge',
  SPLIT: 'split',
  COMPRESS: 'compress',
  ROTATE: 'rotate',
  CONVERT: 'convert',
  EDIT: 'edit',
  PAGES: 'pages',
} as const;

export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const FILE_MIME_TYPES = {
  PDF: 'application/pdf',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  TIFF: 'image/tiff',
} as const;

export const ALLOWED_MIME_TYPES = [
  FILE_MIME_TYPES.PDF,
  FILE_MIME_TYPES.JPEG,
  FILE_MIME_TYPES.PNG,
  FILE_MIME_TYPES.TIFF,
];
