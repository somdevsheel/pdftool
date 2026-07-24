import { Tool } from '../types';
import { ENDPOINTS } from '../api/endpoints';

export const TOOLS: Tool[] = [
  { id: 'pdf-viewer',  name: 'PDF Viewer',      desc: 'Open and read any PDF',         icon: { name: 'eye-outline' },        color: '#4D8BFF', category: 'PDF Tools',        endpoint: '',                    inputType: 'pdf',         outputExt: 'pdf',   screen: 'PdfViewerScreen' },
  { id: 'merge',       name: 'Merge PDF',      desc: 'Combine multiple PDFs',         icon: { name: 'git-merge-outline' },  color: '#4D8BFF', category: 'PDF Tools',        endpoint: ENDPOINTS.merge,       inputType: 'multi-pdf',   outputExt: 'pdf' },
  { id: 'split',       name: 'Split PDF',       desc: 'Separate into multiple files',  icon: { name: 'cut-outline' },        color: '#FF4D4D', category: 'PDF Tools',        endpoint: ENDPOINTS.split,       inputType: 'pdf',         outputExt: 'zip' },
  { id: 'compress',    name: 'Compress PDF',    desc: 'Reduce file size',              icon: { name: 'contract-outline' },   color: '#FFD74D', category: 'PDF Tools',        endpoint: ENDPOINTS.compress,    inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'rotate',      name: 'Rotate PDF',      desc: 'Rotate pages',                  icon: { name: 'sync-outline' },       color: '#FF8B4D', category: 'PDF Tools',        endpoint: ENDPOINTS.rotate,      inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'protect',     name: 'Protect PDF',     desc: 'Password protect',              icon: { name: 'lock-closed-outline' },color: '#4D8BFF', category: 'Security Tools',   endpoint: ENDPOINTS.protect,     inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'jpg-to-pdf',  name: 'JPG to PDF',      desc: 'Convert images to PDF',         icon: { name: 'image-outline' },      color: '#4DFFDB', category: 'Conversion Tools', endpoint: ENDPOINTS.convert,     inputType: 'multi-image', outputExt: 'pdf' },
  { id: 'pdf-to-word', name: 'PDF to Word',     desc: 'Convert to DOCX',               icon: { name: 'document-text-outline' }, color: '#4D8BFF', category: 'Conversion Tools', endpoint: ENDPOINTS.pdfToOffice, inputType: 'pdf',         outputExt: 'docx' },
  { id: 'pdf-to-ppt',  name: 'PDF to PPT',      desc: 'Convert to PowerPoint',         icon: { name: 'easel-outline' },      color: '#FF8B4D', category: 'Conversion Tools', endpoint: ENDPOINTS.pdfToOffice, inputType: 'pdf',         outputExt: 'pptx' },
  { id: 'pdf-to-excel',name: 'PDF to Excel',    desc: 'Convert to spreadsheet',        icon: { name: 'grid-outline' },       color: '#4DFF8B', category: 'Conversion Tools', endpoint: ENDPOINTS.pdfToOffice, inputType: 'pdf',         outputExt: 'xlsx' },
  { id: 'pdf-to-jpg',  name: 'PDF to JPG',      desc: 'Convert pages to images',       icon: { name: 'images-outline' },     color: '#8B4DFF', category: 'Conversion Tools', endpoint: ENDPOINTS.pdfToImg,    inputType: 'pdf',         outputExt: 'zip' },
  { id: 'word-to-pdf', name: 'Word to PDF',     desc: 'Convert DOCX to PDF',           icon: { name: 'document-outline' },   color: '#4D8BFF', category: 'Conversion Tools', endpoint: ENDPOINTS.officeToPdf, inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'organize',    name: 'Organize Pages',  desc: 'Delete or extract pages',       icon: { name: 'layers-outline' },     color: '#4DFF8B', category: 'PDF Tools',        endpoint: ENDPOINTS.pages,       inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'number',      name: 'Number Pages',    desc: 'Add page numbers',              icon: { name: 'list-outline' },       color: '#FF4D8B', category: 'PDF Tools',        endpoint: ENDPOINTS.numberPages, inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'crop',        name: 'Crop PDF',        desc: 'Trim page margins',             icon: { name: 'resize-outline' },     color: '#4DFFDB', category: 'PDF Tools',        endpoint: ENDPOINTS.crop,        inputType: 'pdf',         outputExt: 'pdf' },
  { id: 'insert',      name: 'Insert Pages',    desc: 'Add pages to PDF',              icon: { name: 'add-circle-outline' }, color: '#FFD74D', category: 'PDF Tools',        endpoint: ENDPOINTS.insertPages, inputType: 'multi-pdf',   outputExt: 'pdf' },
  { id: 'sign',        name: 'Sign PDF',        desc: 'Add signature (coming soon)',   icon: { name: 'create-outline' },     color: '#8B4DFF', category: 'Security Tools',   endpoint: '',                    inputType: 'pdf',         outputExt: 'pdf',   disabled: true },
];

export const TOOL_CATEGORIES = [
  'All',
  'PDF Tools',
  'Conversion Tools',
  'Security Tools',
];

export const FEATURED_TOOLS = TOOLS.slice(0, 8);
