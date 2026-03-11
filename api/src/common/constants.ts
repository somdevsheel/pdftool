export const QUEUE_NAMES = { PDF_PROCESSING: 'pdf-processing' } as const;

export const JOB_TYPES = {
  MERGE: 'merge', SPLIT: 'split', COMPRESS: 'compress', ROTATE: 'rotate',
  CONVERT: 'convert', EDIT: 'edit', PAGES: 'pages',
  PDF_TO_IMG: 'pdf-to-img', OFFICE_TO_PDF: 'office-to-pdf', PDF_TO_OFFICE: 'pdf-to-office',
  PROTECT: 'protect', INSERT_PAGES: 'insert-pages',
  NUMBER_PAGES: 'number-pages', CROP: 'crop',
} as const;

export const JOB_STATUS = {
  PENDING: 'PENDING', PROCESSING: 'PROCESSING', COMPLETED: 'COMPLETED', FAILED: 'FAILED',
} as const;

export const ALLOWED_MIME_TYPES = [
  'application/pdf', 'image/jpeg', 'image/png', 'image/tiff',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword', 'application/vnd.ms-powerpoint', 'application/vnd.ms-excel',
];