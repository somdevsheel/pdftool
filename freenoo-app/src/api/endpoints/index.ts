import { API_BASE } from '../client/axios';

export const ENDPOINTS = {
  // Upload
  upload:       `${API_BASE}/upload`,
  uploadMulti:  `${API_BASE}/upload/multiple`,

  // Jobs
  merge:        `${API_BASE}/jobs/merge`,
  split:        `${API_BASE}/jobs/split`,
  compress:     `${API_BASE}/jobs/compress`,
  rotate:       `${API_BASE}/jobs/rotate`,
  convert:      `${API_BASE}/jobs/convert`,
  protect:      `${API_BASE}/jobs/protect`,
  pdfToOffice:  `${API_BASE}/jobs/pdf-to-office`,
  officeToPdf:  `${API_BASE}/jobs/office-to-pdf`,
  pdfToImg:     `${API_BASE}/jobs/pdf-to-img`,
  pages:        `${API_BASE}/jobs/pages`,
  crop:         `${API_BASE}/jobs/crop`,
  numberPages:  `${API_BASE}/jobs/number-pages`,
  insertPages:  `${API_BASE}/jobs/insert-pages`,

  // Status
  job:      (id: string) => `${API_BASE}/jobs/${id}`,
  download: (id: string) => `${API_BASE}/download/${id}`,
  health:   `${API_BASE}/health`,
};
