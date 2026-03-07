export const QUEUE_NAMES = {
  PDF_PROCESSING: 'pdf-processing',
} as const;

export const JOB_TYPES = {
  MERGE:         'merge',
  SPLIT:         'split',
  COMPRESS:      'compress',
  ROTATE:        'rotate',
  CONVERT:       'convert',
  EDIT:          'edit',
  PAGES:         'pages',
  PDF_TO_IMG:    'pdf-to-img',
  OFFICE_TO_PDF: 'office-to-pdf',
  PDF_TO_OFFICE: 'pdf-to-office',
  PROTECT:       'protect',
  INSERT_PAGES:  'insert-pages',
  NUMBER_PAGES:  'number-pages',
  CROP:          'crop',
} as const;
