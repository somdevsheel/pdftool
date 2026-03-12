// import Link from 'next/link';
// import { TopAd } from '../components/ads/TopAd';
// import { BottomAd } from '../components/ads/BottomAd';
// import FeaturedNewsSection from '@/components/FeaturedNewsSection';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'PDF.tools — Free Online PDF Tools | Merge, Compress, Split',
//   description:
//     'Free online PDF tools: merge, split, compress, rotate, convert, edit and sign PDFs. No account needed. Files auto-deleted after 60 minutes.',
//   alternates: { canonical: 'https://pdf.tools' },
//   openGraph: {
//     title: 'PDF.tools — Free Online PDF Tools',
//     description: 'Merge, split, compress, rotate, convert and sign PDFs online for free. No signup required.',
//     url: 'https://pdf.tools',
//     type: 'website',
//   },
// };

// const EDIT_TOOLS = [
//   {
//     id: 'merge',
//     name: 'Combine files',
//     desc: 'Merge multiple PDF files into one document',
//     route: '/merge-pdf',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M8 28V14a2 2 0 012-2h8l4 4h8a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.12)"/>
//         <path d="M14 8v6M20 8v6M26 8v6M14 11h12" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M17 22l3 3 3-3M20 19v6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'split',
//     name: 'Split a PDF',
//     desc: 'Separate a PDF into multiple files',
//     route: '/split-pdf',
//     color: '#E8526A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 10h20v20H10z" stroke="#E8526A" strokeWidth="1.8" rx="2" fill="rgba(232,82,106,0.1)"/>
//         <path d="M20 10v20M10 20h20" stroke="#E8526A" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2"/>
//         <path d="M15 8l-4 4 4-4zM25 8l4 4-4-4z" stroke="#E8526A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'compress',
//     name: 'Compress a PDF',
//     desc: 'Reduce file size without losing quality',
//     route: '/compress-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M20 30v-8M17 25l3-3 3 3" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'organize',
//     name: 'Organize pages',
//     desc: 'Reorder, delete, or rearrange PDF pages',
//     route: '/organize',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="21" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="8" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="21" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <path d="M13 18l2 2 4-4" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'rotate',
//     name: 'Rotate pages',
//     desc: 'Rotate one or all pages left or right',
//     route: '/rotate-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M28 8c2 1.5 3 4 2.5 6.5" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M30 8l-1.5 3.5L32 9.5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'delete-pages',
//     name: 'Delete pages',
//     desc: 'Remove unwanted pages from your PDF',
//     route: '/delete-pages',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h20v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.12)"/>
//         <path d="M8 8h24" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M16 6h8" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M16 17l8 6M24 17l-8 6" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'extract',
//     name: 'Extract pages',
//     desc: 'Save selected pages as a new PDF',
//     route: '/extract',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l8 8v16a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M24 8v8h8" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M20 20v10M15 25l5 5 5-5" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'reorder',
//     name: 'Reorder pages',
//     desc: 'Drag and drop to rearrange page order',
//     route: '/reorder',
//     color: '#E87CF3',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
//         <rect x="22" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
//         <path d="M12 27l4-4-4 4zM28 27l-4-4 4 4z" stroke="#E87CF3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M12 27h16" stroke="#E87CF3" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'insert',
//     name: 'Insert pages',
//     desc: 'Add pages into an existing PDF',
//     route: '/insert',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M20 20v8M16 24h8" stroke="#5BB8F5" strokeWidth="2" strokeLinecap="round"/>
//         <circle cx="28" cy="12" r="5" fill="#5BB8F5" stroke="none"/>
//         <path d="M26 12h4M28 10v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'crop',
//     name: 'Crop pages',
//     desc: 'Trim margins and resize PDF pages',
//     route: '/crop',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 10v20h20" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M8 16h12v12H8z" stroke="#3FC87A" strokeWidth="1.8" rx="1" fill="rgba(63,200,122,0.12)" strokeDasharray="2.5 1.5"/>
//         <path d="M20 10v6M30 30v-6" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'protect',
//     name: 'Protect a PDF',
//     desc: 'Lock your PDF with a password',
//     route: '/protect-pdf',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M20 8l-10 4v8c0 6 4.5 11.5 10 14 5.5-2.5 10-8 10-14v-8l-10-4z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <circle cx="20" cy="21" r="3" stroke="#5BB8F5" strokeWidth="1.8"/>
//         <path d="M20 24v3" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'number-pages',
//     name: 'Number pages',
//     desc: 'Stamp page numbers onto your PDF',
//     route: '/number-pages',
//     color: '#E87CF3',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.1)"/>
//         <path d="M24 8v6h6" stroke="#E87CF3" strokeWidth="1.8" strokeLinejoin="round"/>
//         <rect x="13" y="28" width="14" height="5" rx="2.5" stroke="#E87CF3" strokeWidth="1.5" fill="rgba(232,124,243,0.15)"/>
//         <path d="M16 31h8" stroke="#E87CF3" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'edit',
//     name: 'Edit PDF',
//     desc: 'Add text, annotations, and highlights',
//     route: '/edit-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M24 26l-8 2 2-8 6 6z" stroke="#F5A623" strokeWidth="1.5" fill="rgba(245,166,35,0.2)" strokeLinejoin="round"/>
//         <path d="M22 20l4 4" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'ocr',
//     name: 'Recognize text with OCR',
//     desc: 'Make text in your PDF searchable and editable',
//     route: '/pdf-ocr',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="24" height="24" rx="3" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
//         <path d="M13 16h14M13 20h14M13 24h10" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round"/>
//         <circle cx="30" cy="30" r="6" fill="#3FC87A"/>
//         <text x="27.5" y="33.5" fontSize="8" fontFamily="serif" fontWeight="bold" fill="white">A</text>
//       </svg>
//     ),
//   },
// ];

// const CONVERT_TOOLS = [
//   {
//     id: 'pdf-to-word',
//     name: 'PDF to Word',
//     desc: 'Convert PDFs to Microsoft Word files',
//     route: '/pdf-to-word',
//     color: '#2B5EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.15)"/>
//         <path d="M22 18l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-ppt',
//     name: 'PDF to PPT',
//     desc: 'Convert PDFs to Microsoft PowerPoint files',
//     route: '/pdf-to-ppt',
//     color: '#E8522A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.15)"/>
//         <rect x="21" y="16" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.4" fill="rgba(232,82,42,0.1)"/>
//         <path d="M21 26h10M21 29h6" stroke="#E8522A" strokeWidth="1.4" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-excel',
//     name: 'PDF to Excel',
//     desc: 'Convert PDFs to Microsoft Excel files',
//     route: '/pdf-to-excel',
//     color: '#1E7E34',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.15)"/>
//         <path d="M20 16h12M20 20h12M20 24h12M20 28h12M26 16v16" stroke="#1E7E34" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-jpg',
//     name: 'PDF to JPG',
//     desc: 'Convert PDFs to JPG or other image formats',
//     route: '/pdf-to-jpg',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="14" width="16" height="16" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
//         <circle cx="23" cy="19" r="2" stroke="#C17EE8" strokeWidth="1.4"/>
//         <path d="M18 28l5-5 3 3 2-2 4 4" stroke="#C17EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'word-to-pdf',
//     name: 'Word to PDF',
//     desc: 'Convert Microsoft Word files to PDF',
//     route: '/word-to-pdf',
//     color: '#2B5EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.12)"/>
//         <path d="M10 16l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'ppt-to-pdf',
//     name: 'PPT to PDF',
//     desc: 'Convert Microsoft PowerPoint files to PDF',
//     route: '/ppt-to-pdf',
//     color: '#E8522A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.12)"/>
//         <rect x="9" y="14" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.3" fill="rgba(232,82,42,0.1)"/>
//         <path d="M9 24h10M9 27h6" stroke="#E8522A" strokeWidth="1.3" strokeLinecap="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'excel-to-pdf',
//     name: 'Excel to PDF',
//     desc: 'Convert Microsoft Excel files to PDF',
//     route: '/excel-to-pdf',
//     color: '#1E7E34',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.12)"/>
//         <path d="M8 15h12M8 19h12M8 23h12M8 27h12M14 15v16" stroke="#1E7E34" strokeWidth="1.1" strokeLinecap="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'convert',
//     name: 'JPG to PDF',
//     desc: 'Convert JPG, PNG, and other images to PDF',
//     route: '/jpg-to-pdf',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="14" rx="2" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <circle cx="10" cy="14" r="2" stroke="#5BB8F5" strokeWidth="1.3"/>
//         <path d="M6 20l4-4 3 3 3-2 6 5" stroke="#5BB8F5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//         <rect x="18" y="18" width="16" height="14" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="29" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
// ];

// const ESIGN_TOOLS = [
//   {
//     id: 'fill-sign',
//     name: 'Fill & Sign',
//     desc: 'Complete a form and add your signature',
//     route: '/sign-pdf',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
//         <path d="M24 8v6h6" stroke="#C17EE8" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M14 22c2-3 4-3 5 0s3 3 5 0" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
//         <path d="M13 27h14" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'request-signatures',
//     name: 'Request e-signatures',
//     desc: 'Send a document to anyone to e-sign online fast',
//     route: '/request-signatures',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
//         <path d="M24 8v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
//         <circle cx="28" cy="28" r="7" stroke="#6B7FD7" strokeWidth="1.6" fill="rgba(107,127,215,0.15)"/>
//         <path d="M25 28h6M28 25v6" stroke="#6B7FD7" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'add-signature',
//     name: 'Add a signature',
//     desc: 'Sign a document yourself',
//     route: '/add-signature',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M24 8v6h6" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M14 24c1.5-4 3-4 4 0 1 4 2.5 4 4 0s2.5-4 4 0" stroke="#5BB8F5" strokeWidth="1.6" strokeLinecap="round"/>
//         <path d="M13 29h14" stroke="#5BB8F5" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'esign-template',
//     name: 'Create e-sign template',
//     desc: 'Create a reusable document to send for e-signature faster',
//     route: '/esign-template',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
//         <rect x="16" y="14" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
//         <path d="M20 19h6M20 23h6M20 27h4" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'web-form',
//     name: 'Create a web form',
//     desc: 'Add forms to your website and collect data online',
//     route: '/web-form',
//     color: '#E8526A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="12" width="24" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <path d="M15 20l-4 2 4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M25 20l4 2-4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M21 17l-3 8" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'send-bulk',
//     name: 'Send in bulk',
//     desc: 'Send a document to many people at once to sign individually',
//     route: '/send-bulk',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M8 14h16l6 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2V16a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
//         <path d="M24 14v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
//         <circle cx="14" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//         <circle cx="22" cy="8" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//         <circle cx="30" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'esign-branding',
//     name: 'Add e-sign branding',
//     desc: 'Add your company name, logo, and a custom URL to e-sign agreements',
//     route: '/esign-branding',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="12" width="24" height="16" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
//         <path d="M10 20h8M10 24h5" stroke="#3FC87A" strokeWidth="1.4" strokeLinecap="round"/>
//         <circle cx="30" cy="28" r="6" fill="#3FC87A"/>
//         <path d="M28 28h4M30 26v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
// ];

// type ToolDef = { id: string; name: string; desc: string; route: string; color: string; icon: React.ReactNode };

// function ToolCard({ tool }: { tool: ToolDef }) {
//   return (
//     <Link href={tool.route} className="tool-card group flex flex-col gap-3 p-5 rounded-lg transition-all duration-150">
//       <div className="tool-card-icon w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
//         {tool.icon}
//       </div>
//       <div>
//         <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{tool.name}</h3>
//         <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
//       </div>
//       <p className="text-xs mt-auto" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//         Drag and drop, or <span style={{ color: tool.color }}>select a file</span>
//       </p>
//     </Link>
//   );
// }

// function SectionHeader({ title, count }: { title: string; count: number }) {
//   return (
//     <div className="flex items-center gap-4 mb-5">
//       <h2 className="text-base font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{title}</h2>
//       <div className="flex-1" style={{ height: '1px', background: 'var(--border)' }} />
//       <span className="stamp">{count}</span>
//     </div>
//   );
// }

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
//       <TopAd />

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </div>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '#edit'], ['Convert', '#convert'], ['E-Sign', '#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
//               <a key={href} href={href} className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* Hero */}
//       <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-14">
//           <div className="max-w-2xl">
//             <div className="stamp mb-5">
//               <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor"><circle cx="3.5" cy="3.5" r="3.5"/></svg>
//               100% Free · Anonymous · No watermarks
//             </div>
//             <h1 className="font-bold mb-4 leading-tight" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
//               Every PDF tool<br />
//               <span style={{ color: 'var(--accent)' }}>in one place.</span>
//             </h1>
//             <p className="text-base mb-8 max-w-xl" style={{ color: 'var(--text-muted)' }}>
//               Edit, merge, split, compress, rotate, protect, convert PDFs and more.
//               No login. No watermarks. Files deleted in 60 minutes.
//             </p>
//             <div className="flex flex-wrap gap-3">
//               <Link href="/merge" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium text-white">
//                 Get started
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </Link>
//               <a href="#edit" className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium">
//                 Browse all tools ↓
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Tool grid */}
//       <main className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-14">

//         <section id="edit">
//           <SectionHeader title="Edit" count={EDIT_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {EDIT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         <section id="convert">
//           <SectionHeader title="Convert" count={CONVERT_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {CONVERT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         <section id="esign">
//           <SectionHeader title="E-Sign" count={ESIGN_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {ESIGN_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         {/* Feature strip */}
//         <div className="pt-10 grid sm:grid-cols-3 gap-8" style={{ borderTop: '1px solid var(--border)' }}>
//           {[
//             { icon: '🔒', title: 'Private by default', body: 'Files processed server-side and auto-deleted after 60 minutes.' },
//             { icon: '⚡', title: 'Powered by real tools', body: 'qpdf, Ghostscript, and pdf-lib for industry-standard processing.' },
//             { icon: '∞', title: 'Unlimited & free', body: 'No account needed. No watermarks. No file limits. Just upload and go.' },
//           ].map((f) => (
//             <div key={f.title} className="flex gap-4">
//               <span className="text-2xl flex-shrink-0">{f.icon}</span>
//               <div>
//                 <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{f.title}</h4>
//                 <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.body}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Featured Tech News */}
//         <FeaturedNewsSection />

//       </main>

//       <BottomAd />

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



// import Link from 'next/link';
// import { TopAd } from '../components/ads/TopAd';
// import { BottomAd } from '../components/ads/BottomAd';
// import FeaturedNewsSection from '@/components/FeaturedNewsSection';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'PDF.tools — Free Online PDF Tools | Merge, Compress, Split',
//   description:
//     'Free online PDF tools: merge, split, compress, rotate, convert, edit and sign PDFs. No account needed. Files auto-deleted after 60 minutes.',
//   alternates: { canonical: 'https://pdf.tools' },
//   openGraph: {
//     title: 'PDF.tools — Free Online PDF Tools',
//     description: 'Merge, split, compress, rotate, convert and sign PDFs online for free. No signup required.',
//     url: 'https://pdf.tools',
//     type: 'website',
//   },
// };

// const EDIT_TOOLS = [
//   {
//     id: 'merge',
//     name: 'Combine files',
//     desc: 'Merge multiple PDF files into one document',
//     route: '/merge-pdf',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M8 28V14a2 2 0 012-2h8l4 4h8a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.12)"/>
//         <path d="M14 8v6M20 8v6M26 8v6M14 11h12" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M17 22l3 3 3-3M20 19v6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'split',
//     name: 'Split a PDF',
//     desc: 'Separate a PDF into multiple files',
//     route: '/split-pdf',
//     color: '#E8526A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 10h20v20H10z" stroke="#E8526A" strokeWidth="1.8" rx="2" fill="rgba(232,82,106,0.1)"/>
//         <path d="M20 10v20M10 20h20" stroke="#E8526A" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2"/>
//         <path d="M15 8l-4 4 4-4zM25 8l4 4-4-4z" stroke="#E8526A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'compress',
//     name: 'Compress a PDF',
//     desc: 'Reduce file size without losing quality',
//     route: '/compress-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M20 30v-8M17 25l3-3 3 3" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'organize',
//     name: 'Organize pages',
//     desc: 'Reorder, delete, or rearrange PDF pages',
//     route: '/organize',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="21" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="8" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="21" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <path d="M13 18l2 2 4-4" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'rotate',
//     name: 'Rotate pages',
//     desc: 'Rotate one or all pages left or right',
//     route: '/rotate-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M28 8c2 1.5 3 4 2.5 6.5" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M30 8l-1.5 3.5L32 9.5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'delete-pages',
//     name: 'Delete pages',
//     desc: 'Remove unwanted pages from your PDF',
//     route: '/delete-pages',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h20v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.12)"/>
//         <path d="M8 8h24" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M16 6h8" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M16 17l8 6M24 17l-8 6" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'extract',
//     name: 'Extract pages',
//     desc: 'Save selected pages as a new PDF',
//     route: '/extract',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l8 8v16a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M24 8v8h8" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M20 20v10M15 25l5 5 5-5" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'reorder',
//     name: 'Reorder pages',
//     desc: 'Drag and drop to rearrange page order',
//     route: '/reorder',
//     color: '#E87CF3',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
//         <rect x="22" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
//         <path d="M12 27l4-4-4 4zM28 27l-4-4 4 4z" stroke="#E87CF3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M12 27h16" stroke="#E87CF3" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'insert',
//     name: 'Insert pages',
//     desc: 'Add pages into an existing PDF',
//     route: '/insert',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M20 20v8M16 24h8" stroke="#5BB8F5" strokeWidth="2" strokeLinecap="round"/>
//         <circle cx="28" cy="12" r="5" fill="#5BB8F5" stroke="none"/>
//         <path d="M26 12h4M28 10v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'crop',
//     name: 'Crop pages',
//     desc: 'Trim margins and resize PDF pages',
//     route: '/crop',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 10v20h20" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M8 16h12v12H8z" stroke="#3FC87A" strokeWidth="1.8" rx="1" fill="rgba(63,200,122,0.12)" strokeDasharray="2.5 1.5"/>
//         <path d="M20 10v6M30 30v-6" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'protect',
//     name: 'Protect a PDF',
//     desc: 'Lock your PDF with a password',
//     route: '/protect-pdf',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M20 8l-10 4v8c0 6 4.5 11.5 10 14 5.5-2.5 10-8 10-14v-8l-10-4z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <circle cx="20" cy="21" r="3" stroke="#5BB8F5" strokeWidth="1.8"/>
//         <path d="M20 24v3" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'number-pages',
//     name: 'Number pages',
//     desc: 'Stamp page numbers onto your PDF',
//     route: '/number-pages',
//     color: '#E87CF3',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.1)"/>
//         <path d="M24 8v6h6" stroke="#E87CF3" strokeWidth="1.8" strokeLinejoin="round"/>
//         <rect x="13" y="28" width="14" height="5" rx="2.5" stroke="#E87CF3" strokeWidth="1.5" fill="rgba(232,124,243,0.15)"/>
//         <path d="M16 31h8" stroke="#E87CF3" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'edit',
//     name: 'Edit PDF',
//     desc: 'Add text, annotations, and highlights',
//     route: '/edit-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M24 26l-8 2 2-8 6 6z" stroke="#F5A623" strokeWidth="1.5" fill="rgba(245,166,35,0.2)" strokeLinejoin="round"/>
//         <path d="M22 20l4 4" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'ocr',
//     name: 'Recognize text with OCR',
//     desc: 'Make text in your PDF searchable and editable',
//     route: '/pdf-ocr',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="24" height="24" rx="3" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
//         <path d="M13 16h14M13 20h14M13 24h10" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round"/>
//         <circle cx="30" cy="30" r="6" fill="#3FC87A"/>
//         <text x="27.5" y="33.5" fontSize="8" fontFamily="serif" fontWeight="bold" fill="white">A</text>
//       </svg>
//     ),
//   },
// ];

// const CONVERT_TOOLS = [
//   {
//     id: 'pdf-to-word',
//     name: 'PDF to Word',
//     desc: 'Convert PDFs to Microsoft Word files',
//     route: '/pdf-to-word',
//     color: '#2B5EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.15)"/>
//         <path d="M22 18l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-ppt',
//     name: 'PDF to PPT',
//     desc: 'Convert PDFs to Microsoft PowerPoint files',
//     route: '/pdf-to-ppt',
//     color: '#E8522A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.15)"/>
//         <rect x="21" y="16" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.4" fill="rgba(232,82,42,0.1)"/>
//         <path d="M21 26h10M21 29h6" stroke="#E8522A" strokeWidth="1.4" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-excel',
//     name: 'PDF to Excel',
//     desc: 'Convert PDFs to Microsoft Excel files',
//     route: '/pdf-to-excel',
//     color: '#1E7E34',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.15)"/>
//         <path d="M20 16h12M20 20h12M20 24h12M20 28h12M26 16v16" stroke="#1E7E34" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-jpg',
//     name: 'PDF to JPG',
//     desc: 'Convert PDFs to JPG or other image formats',
//     route: '/pdf-to-jpg',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="14" width="16" height="16" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
//         <circle cx="23" cy="19" r="2" stroke="#C17EE8" strokeWidth="1.4"/>
//         <path d="M18 28l5-5 3 3 2-2 4 4" stroke="#C17EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'word-to-pdf',
//     name: 'Word to PDF',
//     desc: 'Convert Microsoft Word files to PDF',
//     route: '/word-to-pdf',
//     color: '#2B5EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.12)"/>
//         <path d="M10 16l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'ppt-to-pdf',
//     name: 'PPT to PDF',
//     desc: 'Convert Microsoft PowerPoint files to PDF',
//     route: '/ppt-to-pdf',
//     color: '#E8522A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.12)"/>
//         <rect x="9" y="14" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.3" fill="rgba(232,82,42,0.1)"/>
//         <path d="M9 24h10M9 27h6" stroke="#E8522A" strokeWidth="1.3" strokeLinecap="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'excel-to-pdf',
//     name: 'Excel to PDF',
//     desc: 'Convert Microsoft Excel files to PDF',
//     route: '/excel-to-pdf',
//     color: '#1E7E34',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.12)"/>
//         <path d="M8 15h12M8 19h12M8 23h12M8 27h12M14 15v16" stroke="#1E7E34" strokeWidth="1.1" strokeLinecap="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'convert',
//     name: 'JPG to PDF',
//     desc: 'Convert JPG, PNG, and other images to PDF',
//     route: '/jpg-to-pdf',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="14" rx="2" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <circle cx="10" cy="14" r="2" stroke="#5BB8F5" strokeWidth="1.3"/>
//         <path d="M6 20l4-4 3 3 3-2 6 5" stroke="#5BB8F5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//         <rect x="18" y="18" width="16" height="14" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="29" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
// ];

// const ESIGN_TOOLS = [
//   {
//     id: 'fill-sign',
//     name: 'Fill & Sign',
//     desc: 'Complete a form and add your signature',
//     route: '/sign-pdf',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
//         <path d="M24 8v6h6" stroke="#C17EE8" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M14 22c2-3 4-3 5 0s3 3 5 0" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
//         <path d="M13 27h14" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'request-signatures',
//     name: 'Request e-signatures',
//     desc: 'Send a document to anyone to e-sign online fast',
//     route: '/request-signatures',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
//         <path d="M24 8v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
//         <circle cx="28" cy="28" r="7" stroke="#6B7FD7" strokeWidth="1.6" fill="rgba(107,127,215,0.15)"/>
//         <path d="M25 28h6M28 25v6" stroke="#6B7FD7" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'add-signature',
//     name: 'Add a signature',
//     desc: 'Sign a document yourself',
//     route: '/add-signature',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M24 8v6h6" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M14 24c1.5-4 3-4 4 0 1 4 2.5 4 4 0s2.5-4 4 0" stroke="#5BB8F5" strokeWidth="1.6" strokeLinecap="round"/>
//         <path d="M13 29h14" stroke="#5BB8F5" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'esign-template',
//     name: 'Create e-sign template',
//     desc: 'Create a reusable document to send for e-signature faster',
//     route: '/esign-template',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
//         <rect x="16" y="14" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
//         <path d="M20 19h6M20 23h6M20 27h4" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'web-form',
//     name: 'Create a web form',
//     desc: 'Add forms to your website and collect data online',
//     route: '/web-form',
//     color: '#E8526A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="12" width="24" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <path d="M15 20l-4 2 4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M25 20l4 2-4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M21 17l-3 8" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'send-bulk',
//     name: 'Send in bulk',
//     desc: 'Send a document to many people at once to sign individually',
//     route: '/send-bulk',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M8 14h16l6 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2V16a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
//         <path d="M24 14v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
//         <circle cx="14" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//         <circle cx="22" cy="8" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//         <circle cx="30" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'esign-branding',
//     name: 'Add e-sign branding',
//     desc: 'Add your company name, logo, and a custom URL to e-sign agreements',
//     route: '/esign-branding',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="12" width="24" height="16" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
//         <path d="M10 20h8M10 24h5" stroke="#3FC87A" strokeWidth="1.4" strokeLinecap="round"/>
//         <circle cx="30" cy="28" r="6" fill="#3FC87A"/>
//         <path d="M28 28h4M30 26v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
// ];

// type ToolDef = { id: string; name: string; desc: string; route: string; color: string; icon: React.ReactNode };

// function ToolCard({ tool }: { tool: ToolDef }) {
//   return (
//     <Link href={tool.route} className="tool-card group flex flex-col gap-3 p-5 rounded-lg transition-all duration-150">
//       <div className="tool-card-icon w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
//         {tool.icon}
//       </div>
//       <div>
//         <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{tool.name}</h3>
//         <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
//       </div>
//       <p className="text-xs mt-auto" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//         Drag and drop, or <span style={{ color: tool.color }}>select a file</span>
//       </p>
//     </Link>
//   );
// }

// function SectionHeader({ title, count }: { title: string; count: number }) {
//   return (
//     <div className="flex items-center gap-4 mb-5">
//       <h2 className="text-base font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{title}</h2>
//       <div className="flex-1" style={{ height: '1px', background: 'var(--border)' }} />
//       <span className="stamp">{count}</span>
//     </div>
//   );
// }

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
//       <TopAd />

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </div>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '#edit'], ['Convert', '#convert'], ['E-Sign', '#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
//               <a key={href} href={href} className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* Hero */}
//       <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-14">
//           <div className="max-w-2xl">
//             <div className="stamp mb-5">
//               <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor"><circle cx="3.5" cy="3.5" r="3.5"/></svg>
//               100% Free · Anonymous · No watermarks
//             </div>
//             <h1 className="font-bold mb-4 leading-tight" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
//               Every PDF tool<br />
//               <span style={{ color: 'var(--accent)' }}>in one place.</span>
//             </h1>
//             <p className="text-base mb-8 max-w-xl" style={{ color: 'var(--text-muted)' }}>
//               Edit, merge, split, compress, rotate, protect, convert PDFs and more.
//               No login. No watermarks. Files deleted in 60 minutes.
//             </p>
//             <div className="flex flex-wrap gap-3">
//               <Link href="/merge" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium text-white">
//                 Get started
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </Link>
//               <a href="#edit" className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium">
//                 Browse all tools ↓
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Tool grid */}
//       <main className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-14">

//         <section id="edit">
//           <SectionHeader title="Edit" count={EDIT_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {EDIT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         <section id="convert">
//           <SectionHeader title="Convert" count={CONVERT_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {CONVERT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         <section id="esign">
//           <SectionHeader title="E-Sign" count={ESIGN_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {ESIGN_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         {/* Featured Tech News */}
//         <FeaturedNewsSection />

//         {/* Feature strip */}
//         <div className="pt-10 grid sm:grid-cols-3 gap-8" style={{ borderTop: '1px solid var(--border)' }}>
//           {[
//             { icon: '🔒', title: 'Private by default', body: 'Files processed server-side and auto-deleted after 60 minutes.' },
//             { icon: '⚡', title: 'Powered by real tools', body: 'qpdf, Ghostscript, and pdf-lib for industry-standard processing.' },
//             { icon: '∞', title: 'Unlimited & free', body: 'No account needed. No watermarks. No file limits. Just upload and go.' },
//           ].map((f) => (
//             <div key={f.title} className="flex gap-4">
//               <span className="text-2xl flex-shrink-0">{f.icon}</span>
//               <div>
//                 <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{f.title}</h4>
//                 <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.body}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </main>

//       <BottomAd />

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }






// import Link from 'next/link';
// import { TopAd } from '../components/ads/TopAd';
// import { BottomAd } from '../components/ads/BottomAd';
// import FeaturedNewsSection from '@/components/FeaturedNewsSection';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'PDF.tools — Free Online PDF Tools | Merge, Compress, Split',
//   description:
//     'Free online PDF tools: merge, split, compress, rotate, convert, edit and sign PDFs. No account needed. Files auto-deleted after 60 minutes.',
//   alternates: { canonical: 'https://pdf.tools' },
//   openGraph: {
//     title: 'PDF.tools — Free Online PDF Tools',
//     description: 'Merge, split, compress, rotate, convert and sign PDFs online for free. No signup required.',
//     url: 'https://pdf.tools',
//     type: 'website',
//   },
// };

// const EDIT_TOOLS = [
//   {
//     id: 'merge',
//     name: 'Combine files',
//     desc: 'Merge multiple PDF files into one document',
//     route: '/merge-pdf',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M8 28V14a2 2 0 012-2h8l4 4h8a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.12)"/>
//         <path d="M14 8v6M20 8v6M26 8v6M14 11h12" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M17 22l3 3 3-3M20 19v6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'split',
//     name: 'Split a PDF',
//     desc: 'Separate a PDF into multiple files',
//     route: '/split-pdf',
//     color: '#E8526A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 10h20v20H10z" stroke="#E8526A" strokeWidth="1.8" rx="2" fill="rgba(232,82,106,0.1)"/>
//         <path d="M20 10v20M10 20h20" stroke="#E8526A" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2"/>
//         <path d="M15 8l-4 4 4-4zM25 8l4 4-4-4z" stroke="#E8526A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'compress',
//     name: 'Compress a PDF',
//     desc: 'Reduce file size without losing quality',
//     route: '/compress-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M20 30v-8M17 25l3-3 3 3" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'organize',
//     name: 'Organize pages',
//     desc: 'Reorder, delete, or rearrange PDF pages',
//     route: '/organize',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="21" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="8" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <rect x="21" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
//         <path d="M13 18l2 2 4-4" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'rotate',
//     name: 'Rotate pages',
//     desc: 'Rotate one or all pages left or right',
//     route: '/rotate-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M28 8c2 1.5 3 4 2.5 6.5" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M30 8l-1.5 3.5L32 9.5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'delete-pages',
//     name: 'Delete pages',
//     desc: 'Remove unwanted pages from your PDF',
//     route: '/delete-pages',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h20v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.12)"/>
//         <path d="M8 8h24" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M16 6h8" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M16 17l8 6M24 17l-8 6" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'extract',
//     name: 'Extract pages',
//     desc: 'Save selected pages as a new PDF',
//     route: '/extract',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l8 8v16a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M24 8v8h8" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M20 20v10M15 25l5 5 5-5" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'reorder',
//     name: 'Reorder pages',
//     desc: 'Drag and drop to rearrange page order',
//     route: '/reorder',
//     color: '#E87CF3',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
//         <rect x="22" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
//         <path d="M12 27l4-4-4 4zM28 27l-4-4 4 4z" stroke="#E87CF3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M12 27h16" stroke="#E87CF3" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'insert',
//     name: 'Insert pages',
//     desc: 'Add pages into an existing PDF',
//     route: '/insert',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M20 20v8M16 24h8" stroke="#5BB8F5" strokeWidth="2" strokeLinecap="round"/>
//         <circle cx="28" cy="12" r="5" fill="#5BB8F5" stroke="none"/>
//         <path d="M26 12h4M28 10v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'crop',
//     name: 'Crop pages',
//     desc: 'Trim margins and resize PDF pages',
//     route: '/crop',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 10v20h20" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
//         <path d="M8 16h12v12H8z" stroke="#3FC87A" strokeWidth="1.8" rx="1" fill="rgba(63,200,122,0.12)" strokeDasharray="2.5 1.5"/>
//         <path d="M20 10v6M30 30v-6" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'protect',
//     name: 'Protect a PDF',
//     desc: 'Lock your PDF with a password',
//     route: '/protect-pdf',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M20 8l-10 4v8c0 6 4.5 11.5 10 14 5.5-2.5 10-8 10-14v-8l-10-4z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <circle cx="20" cy="21" r="3" stroke="#5BB8F5" strokeWidth="1.8"/>
//         <path d="M20 24v3" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'number-pages',
//     name: 'Number pages',
//     desc: 'Stamp page numbers onto your PDF',
//     route: '/number-pages',
//     color: '#E87CF3',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.1)"/>
//         <path d="M24 8v6h6" stroke="#E87CF3" strokeWidth="1.8" strokeLinejoin="round"/>
//         <rect x="13" y="28" width="14" height="5" rx="2.5" stroke="#E87CF3" strokeWidth="1.5" fill="rgba(232,124,243,0.15)"/>
//         <path d="M16 31h8" stroke="#E87CF3" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'edit',
//     name: 'Edit PDF',
//     desc: 'Add text, annotations, and highlights',
//     route: '/edit-pdf',
//     color: '#F5A623',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
//         <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M24 26l-8 2 2-8 6 6z" stroke="#F5A623" strokeWidth="1.5" fill="rgba(245,166,35,0.2)" strokeLinejoin="round"/>
//         <path d="M22 20l4 4" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'ocr',
//     name: 'Recognize text with OCR',
//     desc: 'Make text in your PDF searchable and editable',
//     route: '/pdf-ocr',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="24" height="24" rx="3" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
//         <path d="M13 16h14M13 20h14M13 24h10" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round"/>
//         <circle cx="30" cy="30" r="6" fill="#3FC87A"/>
//         <text x="27.5" y="33.5" fontSize="8" fontFamily="serif" fontWeight="bold" fill="white">A</text>
//       </svg>
//     ),
//   },
// ];

// const CONVERT_TOOLS = [
//   {
//     id: 'pdf-to-word',
//     name: 'PDF to Word',
//     desc: 'Convert PDFs to Microsoft Word files',
//     route: '/pdf-to-word',
//     color: '#2B5EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.15)"/>
//         <path d="M22 18l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-ppt',
//     name: 'PDF to PPT',
//     desc: 'Convert PDFs to Microsoft PowerPoint files',
//     route: '/pdf-to-ppt',
//     color: '#E8522A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.15)"/>
//         <rect x="21" y="16" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.4" fill="rgba(232,82,42,0.1)"/>
//         <path d="M21 26h10M21 29h6" stroke="#E8522A" strokeWidth="1.4" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-excel',
//     name: 'PDF to Excel',
//     desc: 'Convert PDFs to Microsoft Excel files',
//     route: '/pdf-to-excel',
//     color: '#1E7E34',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="12" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.15)"/>
//         <path d="M20 16h12M20 20h12M20 24h12M20 28h12M26 16v16" stroke="#1E7E34" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'pdf-to-jpg',
//     name: 'PDF to JPG',
//     desc: 'Convert PDFs to JPG or other image formats',
//     route: '/pdf-to-jpg',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <rect x="18" y="14" width="16" height="16" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
//         <circle cx="23" cy="19" r="2" stroke="#C17EE8" strokeWidth="1.4"/>
//         <path d="M18 28l5-5 3 3 2-2 4 4" stroke="#C17EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'word-to-pdf',
//     name: 'Word to PDF',
//     desc: 'Convert Microsoft Word files to PDF',
//     route: '/word-to-pdf',
//     color: '#2B5EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.12)"/>
//         <path d="M10 16l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'ppt-to-pdf',
//     name: 'PPT to PDF',
//     desc: 'Convert Microsoft PowerPoint files to PDF',
//     route: '/ppt-to-pdf',
//     color: '#E8522A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.12)"/>
//         <rect x="9" y="14" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.3" fill="rgba(232,82,42,0.1)"/>
//         <path d="M9 24h10M9 27h6" stroke="#E8522A" strokeWidth="1.3" strokeLinecap="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'excel-to-pdf',
//     name: 'Excel to PDF',
//     desc: 'Convert Microsoft Excel files to PDF',
//     route: '/excel-to-pdf',
//     color: '#1E7E34',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.12)"/>
//         <path d="M8 15h12M8 19h12M8 23h12M8 27h12M14 15v16" stroke="#1E7E34" strokeWidth="1.1" strokeLinecap="round"/>
//         <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
//   {
//     id: 'convert',
//     name: 'JPG to PDF',
//     desc: 'Convert JPG, PNG, and other images to PDF',
//     route: '/jpg-to-pdf',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="10" width="16" height="14" rx="2" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <circle cx="10" cy="14" r="2" stroke="#5BB8F5" strokeWidth="1.3"/>
//         <path d="M6 20l4-4 3 3 3-2 6 5" stroke="#5BB8F5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
//         <rect x="18" y="18" width="16" height="14" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
//         <text x="20" y="29" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
//       </svg>
//     ),
//   },
// ];

// const ESIGN_TOOLS = [
//   {
//     id: 'fill-sign',
//     name: 'Fill & Sign',
//     desc: 'Complete a form and add your signature',
//     route: '/sign-pdf',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
//         <path d="M24 8v6h6" stroke="#C17EE8" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M14 22c2-3 4-3 5 0s3 3 5 0" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
//         <path d="M13 27h14" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'request-signatures',
//     name: 'Request e-signatures',
//     desc: 'Send a document to anyone to e-sign online fast',
//     route: '/request-signatures',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
//         <path d="M24 8v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
//         <circle cx="28" cy="28" r="7" stroke="#6B7FD7" strokeWidth="1.6" fill="rgba(107,127,215,0.15)"/>
//         <path d="M25 28h6M28 25v6" stroke="#6B7FD7" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'add-signature',
//     name: 'Add a signature',
//     desc: 'Sign a document yourself',
//     route: '/add-signature',
//     color: '#5BB8F5',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
//         <path d="M24 8v6h6" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
//         <path d="M14 24c1.5-4 3-4 4 0 1 4 2.5 4 4 0s2.5-4 4 0" stroke="#5BB8F5" strokeWidth="1.6" strokeLinecap="round"/>
//         <path d="M13 29h14" stroke="#5BB8F5" strokeWidth="1.2" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'esign-template',
//     name: 'Create e-sign template',
//     desc: 'Create a reusable document to send for e-signature faster',
//     route: '/esign-template',
//     color: '#C17EE8',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="8" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
//         <rect x="16" y="14" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
//         <path d="M20 19h6M20 23h6M20 27h4" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'web-form',
//     name: 'Create a web form',
//     desc: 'Add forms to your website and collect data online',
//     route: '/web-form',
//     color: '#E8526A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="8" y="12" width="24" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
//         <path d="M15 20l-4 2 4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M25 20l4 2-4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//         <path d="M21 17l-3 8" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'send-bulk',
//     name: 'Send in bulk',
//     desc: 'Send a document to many people at once to sign individually',
//     route: '/send-bulk',
//     color: '#6B7FD7',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <path d="M8 14h16l6 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2V16a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
//         <path d="M24 14v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
//         <circle cx="14" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//         <circle cx="22" cy="8" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//         <circle cx="30" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
//       </svg>
//     ),
//   },
//   {
//     id: 'esign-branding',
//     name: 'Add e-sign branding',
//     desc: 'Add your company name, logo, and a custom URL to e-sign agreements',
//     route: '/esign-branding',
//     color: '#3FC87A',
//     icon: (
//       <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
//         <rect x="6" y="12" width="24" height="16" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
//         <path d="M10 20h8M10 24h5" stroke="#3FC87A" strokeWidth="1.4" strokeLinecap="round"/>
//         <circle cx="30" cy="28" r="6" fill="#3FC87A"/>
//         <path d="M28 28h4M30 26v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
//       </svg>
//     ),
//   },
// ];

// type ToolDef = { id: string; name: string; desc: string; route: string; color: string; icon: React.ReactNode };

// function ToolCard({ tool }: { tool: ToolDef }) {
//   return (
//     <Link href={tool.route} className="tool-card group flex flex-col gap-3 p-5 rounded-lg transition-all duration-150">
//       <div className="tool-card-icon w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
//         {tool.icon}
//       </div>
//       <div>
//         <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{tool.name}</h3>
//         <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
//       </div>
//       <p className="text-xs mt-auto" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
//         Drag and drop, or <span style={{ color: tool.color }}>select a file</span>
//       </p>
//     </Link>
//   );
// }

// function SectionHeader({ title, count }: { title: string; count: number }) {
//   return (
//     <div className="flex items-center gap-4 mb-5">
//       <h2 className="text-base font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{title}</h2>
//       <div className="flex-1" style={{ height: '1px', background: 'var(--border)' }} />
//       <span className="stamp">{count}</span>
//     </div>
//   );
// }

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
//       <TopAd />

//       {/* Header */}
//       <header className="sticky top-0 z-20 backdrop-blur-sm"
//         style={{ background: 'rgba(28,28,28,0.92)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-white"
//               style={{ background: 'var(--accent)' }}>P</div>
//             <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
//               PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//             </span>
//           </div>
//           <nav className="hidden md:flex items-center gap-1 text-sm">
//             {[['Edit', '#edit'], ['Convert', '#convert'], ['E-Sign', '#esign'], ['Tech News', '/tech-news']].map(([label, href]) => (
//               <a key={href} href={href} className="nav-link px-4 py-2 rounded text-sm transition-all duration-150"
//                 style={label === 'Tech News' ? { color: 'var(--accent)' } : {}}>
//                 {label}
//               </a>
//             ))}
//           </nav>
//         </div>
//       </header>

//       {/* Hero */}
//       <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-14">
//           <div className="max-w-2xl">
//             <div className="stamp mb-5">
//               <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor"><circle cx="3.5" cy="3.5" r="3.5"/></svg>
//               100% Free · Anonymous · No watermarks
//             </div>
//             <h1 className="font-bold mb-4 leading-tight" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
//               Every PDF tool<br />
//               <span style={{ color: 'var(--accent)' }}>in one place.</span>
//             </h1>
//             <p className="text-base mb-8 max-w-xl" style={{ color: 'var(--text-muted)' }}>
//               Edit, merge, split, compress, rotate, protect, convert PDFs and more.
//               No login. No watermarks. Files deleted in 60 minutes.
//             </p>
//             <div className="flex flex-wrap gap-3">
//               <Link href="/merge" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium text-white">
//                 Get started
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </Link>
//               <a href="#edit" className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium">
//                 Browse all tools ↓
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Tool grid */}
//       <main className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-14">

//         <section id="edit">
//           <SectionHeader title="Edit" count={EDIT_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {EDIT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         <section id="convert">
//           <SectionHeader title="Convert" count={CONVERT_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {CONVERT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         <section id="esign">
//           <SectionHeader title="E-Sign" count={ESIGN_TOOLS.length} />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {ESIGN_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
//           </div>
//         </section>

//         {/* Featured Tech News */}
//         <FeaturedNewsSection />

        

//         {/* Made in India tagline */}
//         <div
//           className="flex flex-col items-center text-center gap-3 py-10 rounded-lg"
//           style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
//         >
//           <div className="flex items-center gap-2 flex-wrap justify-center" style={{ fontSize: '1.25rem' }}>
//             <span>🇮🇳</span>
//             <span className="font-bold" style={{ color: 'var(--text)' }}>Made in India,</span>
//             <span className="font-bold" style={{ color: 'var(--accent)' }}>Made for the World.</span>
//             <span>🌍</span>
//           </div>
//           <p className="text-xs max-w-md" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
//             Built with love from Uttarakhand — crafted to be fast, free, and accessible to every person, in every country, on every device.
//           </p>
//         </div>

//         {/* Feature strip */}
//         <div className="pt-10 grid sm:grid-cols-3 gap-8" style={{ borderTop: '1px solid var(--border)' }}>
//           {[
//             { icon: '🔒', title: 'Private by default', body: 'Files processed server-side and auto-deleted after 60 minutes.' },
//             { icon: '⚡', title: 'Powered by real tools', body: 'qpdf, Ghostscript, and pdf-lib for industry-standard processing.' },
//             { icon: '∞', title: 'Unlimited & free', body: 'No account needed. No watermarks. No file limits. Just upload and go.' },
//           ].map((f) => (
//             <div key={f.title} className="flex gap-4">
//               <span className="text-2xl flex-shrink-0">{f.icon}</span>
//               <div>
//                 <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{f.title}</h4>
//                 <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.body}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//       </main>

//       <BottomAd />

//       <footer style={{ borderTop: '1px solid var(--border)' }}>
//         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <span className="font-bold" style={{ color: 'var(--text)' }}>
//             PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
//           </span>
//           <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Free · Anonymous · Open source</p>
//         </div>
//       </footer>
//     </div>
//   );
// }





import Link from 'next/link';
import { TopAd } from '../components/ads/TopAd';
import { BottomAd } from '../components/ads/BottomAd';
import FeaturedNewsSection from '@/components/FeaturedNewsSection';
import MobileHeader from '@/components/MobileHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF.tools — Free Online PDF Tools | Merge, Compress, Split',
  description:
    'Free online PDF tools: merge, split, compress, rotate, convert, edit and sign PDFs. No account needed. Files auto-deleted after 60 minutes.',
  alternates: { canonical: 'https://pdf.tools' },
  openGraph: {
    title: 'PDF.tools — Free Online PDF Tools',
    description: 'Merge, split, compress, rotate, convert and sign PDFs online for free. No signup required.',
    url: 'https://pdf.tools',
    type: 'website',
  },
};

/* ─────────────────────────────────────────────────────────────
   EDIT section — all tools that work on an existing PDF
───────────────────────────────────────────────────────────── */
const EDIT_TOOLS = [
  {
    id: 'merge',
    name: 'Combine files',
    desc: 'Merge multiple PDF files into one document',
    route: '/merge-pdf',
    color: '#6B7FD7',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M8 28V14a2 2 0 012-2h8l4 4h8a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.12)"/>
        <path d="M14 8v6M20 8v6M26 8v6M14 11h12" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M17 22l3 3 3-3M20 19v6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'split',
    name: 'Split a PDF',
    desc: 'Separate a PDF into multiple files',
    route: '/split-pdf',
    color: '#E8526A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 10h20v20H10z" stroke="#E8526A" strokeWidth="1.8" rx="2" fill="rgba(232,82,106,0.1)"/>
        <path d="M20 10v20M10 20h20" stroke="#E8526A" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 2"/>
        <path d="M15 8l-4 4 4-4zM25 8l4 4-4-4z" stroke="#E8526A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'compress',
    name: 'Compress a PDF',
    desc: 'Reduce file size without losing quality',
    route: '/compress-pdf',
    color: '#F5A623',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
        <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M20 30v-8M17 25l3-3 3 3" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'organize',
    name: 'Organize pages',
    desc: 'Reorder, delete, or rearrange PDF pages',
    route: '/organize',
    color: '#3FC87A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="8" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
        <rect x="21" y="8" width="11" height="14" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
        <rect x="8" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
        <rect x="21" y="25" width="11" height="7" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.12)"/>
        <path d="M13 18l2 2 4-4" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'rotate',
    name: 'Rotate pages',
    desc: 'Rotate one or all pages left or right',
    route: '/rotate-pdf',
    color: '#F5A623',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
        <path d="M28 8c2 1.5 3 4 2.5 6.5" stroke="#F5A623" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M30 8l-1.5 3.5L32 9.5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'delete-pages',
    name: 'Delete pages',
    desc: 'Remove unwanted pages from your PDF',
    route: '/delete-pages',
    color: '#C17EE8',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h20v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.12)"/>
        <path d="M8 8h24" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16 6h8" stroke="#C17EE8" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16 17l8 6M24 17l-8 6" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'extract',
    name: 'Extract pages',
    desc: 'Save selected pages as a new PDF',
    route: '/extract',
    color: '#5BB8F5',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l8 8v16a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
        <path d="M24 8v8h8" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M20 20v10M15 25l5 5 5-5" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'reorder',
    name: 'Reorder pages',
    desc: 'Drag and drop to rearrange page order',
    route: '/reorder',
    color: '#E87CF3',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="8" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
        <rect x="22" y="10" width="10" height="13" rx="1.5" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.12)"/>
        <path d="M12 27l4-4-4 4zM28 27l-4-4 4 4z" stroke="#E87CF3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 27h16" stroke="#E87CF3" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'insert',
    name: 'Insert pages',
    desc: 'Add pages into an existing PDF',
    route: '/insert',
    color: '#5BB8F5',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 12h14l6 6v10a2 2 0 01-2 2H12a2 2 0 01-2-2V14a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
        <path d="M20 20v8M16 24h8" stroke="#5BB8F5" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="28" cy="12" r="5" fill="#5BB8F5" stroke="none"/>
        <path d="M26 12h4M28 10v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'crop',
    name: 'Crop pages',
    desc: 'Trim margins and resize PDF pages',
    route: '/crop',
    color: '#3FC87A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 10v20h20" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8 16h12v12H8z" stroke="#3FC87A" strokeWidth="1.8" rx="1" fill="rgba(63,200,122,0.12)" strokeDasharray="2.5 1.5"/>
        <path d="M20 10v6M30 30v-6" stroke="#3FC87A" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'protect',
    name: 'Protect a PDF',
    desc: 'Lock your PDF with a password',
    route: '/protect-pdf',
    color: '#5BB8F5',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M20 8l-10 4v8c0 6 4.5 11.5 10 14 5.5-2.5 10-8 10-14v-8l-10-4z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
        <circle cx="20" cy="21" r="3" stroke="#5BB8F5" strokeWidth="1.8"/>
        <path d="M20 24v3" stroke="#5BB8F5" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'number-pages',
    name: 'Number pages',
    desc: 'Stamp page numbers onto your PDF',
    route: '/number-pages',
    color: '#E87CF3',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#E87CF3" strokeWidth="1.8" fill="rgba(232,124,243,0.1)"/>
        <path d="M24 8v6h6" stroke="#E87CF3" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="13" y="28" width="14" height="5" rx="2.5" stroke="#E87CF3" strokeWidth="1.5" fill="rgba(232,124,243,0.15)"/>
        <path d="M16 31h8" stroke="#E87CF3" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'edit',
    name: 'Edit PDF',
    desc: 'Add text, annotations, and highlights',
    route: '/edit-pdf',
    color: '#F5A623',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#F5A623" strokeWidth="1.8" fill="rgba(245,166,35,0.1)"/>
        <path d="M24 8v6h6" stroke="#F5A623" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M24 26l-8 2 2-8 6 6z" stroke="#F5A623" strokeWidth="1.5" fill="rgba(245,166,35,0.2)" strokeLinejoin="round"/>
        <path d="M22 20l4 4" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'ocr',
    name: 'Recognize text with OCR',
    desc: 'Make text in your PDF searchable and editable',
    route: '/pdf-ocr',
    color: '#3FC87A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="8" y="8" width="24" height="24" rx="3" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
        <path d="M13 16h14M13 20h14M13 24h10" stroke="#3FC87A" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="30" cy="30" r="6" fill="#3FC87A"/>
        <text x="27.5" y="33.5" fontSize="8" fontFamily="serif" fontWeight="bold" fill="white">A</text>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   CONVERT section — all format conversion tools
───────────────────────────────────────────────────────────── */
const CONVERT_TOOLS = [
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    desc: 'Convert PDFs to Microsoft Word files',
    route: '/pdf-to-word',
    color: '#2B5EE8',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
        <rect x="18" y="12" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.15)"/>
        <path d="M22 18l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'pdf-to-ppt',
    name: 'PDF to PPT',
    desc: 'Convert PDFs to Microsoft PowerPoint files',
    route: '/pdf-to-ppt',
    color: '#E8522A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
        <rect x="18" y="12" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.15)"/>
        <rect x="21" y="16" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.4" fill="rgba(232,82,42,0.1)"/>
        <path d="M21 26h10M21 29h6" stroke="#E8522A" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    desc: 'Convert PDFs to Microsoft Excel files',
    route: '/pdf-to-excel',
    color: '#1E7E34',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
        <rect x="18" y="12" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.15)"/>
        <path d="M20 16h12M20 20h12M20 24h12M20 28h12M26 16v16" stroke="#1E7E34" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    desc: 'Convert PDFs to JPG or other image formats',
    route: '/pdf-to-jpg',
    color: '#C17EE8',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="8" width="18" height="24" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
        <rect x="18" y="14" width="16" height="16" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
        <circle cx="23" cy="19" r="2" stroke="#C17EE8" strokeWidth="1.4"/>
        <path d="M18 28l5-5 3 3 2-2 4 4" stroke="#C17EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    desc: 'Convert Microsoft Word files to PDF',
    route: '/word-to-pdf',
    color: '#2B5EE8',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="10" width="16" height="20" rx="2" stroke="#2B5EE8" strokeWidth="1.8" fill="rgba(43,94,232,0.12)"/>
        <path d="M10 16l2 8 2-5 2 5 2-8" stroke="#2B5EE8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
        <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
      </svg>
    ),
  },
  {
    id: 'ppt-to-pdf',
    name: 'PPT to PDF',
    desc: 'Convert Microsoft PowerPoint files to PDF',
    route: '/ppt-to-pdf',
    color: '#E8522A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="10" width="16" height="20" rx="2" stroke="#E8522A" strokeWidth="1.8" fill="rgba(232,82,42,0.12)"/>
        <rect x="9" y="14" width="10" height="6" rx="1" stroke="#E8522A" strokeWidth="1.3" fill="rgba(232,82,42,0.1)"/>
        <path d="M9 24h10M9 27h6" stroke="#E8522A" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
        <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
      </svg>
    ),
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    desc: 'Convert Microsoft Excel files to PDF',
    route: '/excel-to-pdf',
    color: '#1E7E34',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="10" width="16" height="20" rx="2" stroke="#1E7E34" strokeWidth="1.8" fill="rgba(30,126,52,0.12)"/>
        <path d="M8 15h12M8 19h12M8 23h12M8 27h12M14 15v16" stroke="#1E7E34" strokeWidth="1.1" strokeLinecap="round"/>
        <rect x="18" y="14" width="16" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
        <text x="20" y="27" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
      </svg>
    ),
  },
  {
    id: 'convert',
    name: 'JPG to PDF',
    desc: 'Convert JPG, PNG, and other images to PDF',
    route: '/jpg-to-pdf',
    color: '#5BB8F5',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="10" width="16" height="14" rx="2" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
        <circle cx="10" cy="14" r="2" stroke="#5BB8F5" strokeWidth="1.3"/>
        <path d="M6 20l4-4 3 3 3-2 6 5" stroke="#5BB8F5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="18" y="18" width="16" height="14" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.12)"/>
        <text x="20" y="29" fontSize="8" fontFamily="monospace" fontWeight="bold" fill="#E8526A">PDF</text>
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────
   E-SIGN section
───────────────────────────────────────────────────────────── */
const ESIGN_TOOLS = [
  {
    id: 'fill-sign',
    name: 'Fill & Sign',
    desc: 'Complete a form and add your signature',
    route: '/sign-pdf',
    color: '#C17EE8',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
        <path d="M24 8v6h6" stroke="#C17EE8" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 22c2-3 4-3 5 0s3 3 5 0" stroke="#C17EE8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 27h14" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  {
    id: 'request-signatures',
    name: 'Request e-signatures',
    desc: 'Send a document to anyone to e-sign online fast',
    route: '/request-signatures',
    color: '#6B7FD7',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
        <path d="M24 8v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="28" cy="28" r="7" stroke="#6B7FD7" strokeWidth="1.6" fill="rgba(107,127,215,0.15)"/>
        <path d="M25 28h6M28 25v6" stroke="#6B7FD7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'add-signature',
    name: 'Add a signature',
    desc: 'Sign a document yourself',
    route: '/add-signature',
    color: '#5BB8F5',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M10 8h14l6 6v18a2 2 0 01-2 2H12a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="#5BB8F5" strokeWidth="1.8" fill="rgba(91,184,245,0.1)"/>
        <path d="M24 8v6h6" stroke="#5BB8F5" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 24c1.5-4 3-4 4 0 1 4 2.5 4 4 0s2.5-4 4 0" stroke="#5BB8F5" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M13 29h14" stroke="#5BB8F5" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'esign-template',
    name: 'Create e-sign template',
    desc: 'Create a reusable document to send for e-signature faster',
    route: '/esign-template',
    color: '#C17EE8',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="8" y="8" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.1)"/>
        <rect x="16" y="14" width="14" height="18" rx="2" stroke="#C17EE8" strokeWidth="1.8" fill="rgba(193,126,232,0.15)"/>
        <path d="M20 19h6M20 23h6M20 27h4" stroke="#C17EE8" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'web-form',
    name: 'Create a web form',
    desc: 'Add forms to your website and collect data online',
    route: '/web-form',
    color: '#E8526A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="8" y="12" width="24" height="18" rx="2" stroke="#E8526A" strokeWidth="1.8" fill="rgba(232,82,106,0.1)"/>
        <path d="M15 20l-4 2 4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M25 20l4 2-4 2" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 17l-3 8" stroke="#E8526A" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'send-bulk',
    name: 'Send in bulk',
    desc: 'Send a document to many people at once to sign individually',
    route: '/send-bulk',
    color: '#6B7FD7',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <path d="M8 14h16l6 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2V16a2 2 0 012-2z" stroke="#6B7FD7" strokeWidth="1.8" fill="rgba(107,127,215,0.1)"/>
        <path d="M24 14v6h6" stroke="#6B7FD7" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="14" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
        <circle cx="22" cy="8" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
        <circle cx="30" cy="10" r="3" stroke="#6B7FD7" strokeWidth="1.5" fill="rgba(107,127,215,0.15)"/>
      </svg>
    ),
  },
  {
    id: 'esign-branding',
    name: 'Add e-sign branding',
    desc: 'Add your company name, logo, and a custom URL to e-sign agreements',
    route: '/esign-branding',
    color: '#3FC87A',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width="36" height="36">
        <rect x="6" y="12" width="24" height="16" rx="2" stroke="#3FC87A" strokeWidth="1.8" fill="rgba(63,200,122,0.1)"/>
        <path d="M10 20h8M10 24h5" stroke="#3FC87A" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="30" cy="28" r="6" fill="#3FC87A"/>
        <path d="M28 28h4M30 26v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

type ToolDef = { id: string; name: string; desc: string; route: string; color: string; icon: React.ReactNode };

function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link href={tool.route} className="tool-card group flex flex-col gap-3 p-5 rounded-lg transition-all duration-150">
      <div className="tool-card-icon w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 mb-1">
        {tool.icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{tool.name}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{tool.desc}</p>
      </div>
      <p className="text-xs mt-auto" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
        Drag and drop, or <span style={{ color: tool.color }}>select a file</span>
      </p>
    </Link>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h2 className="text-base font-semibold whitespace-nowrap" style={{ color: 'var(--text)' }}>{title}</h2>
      <div className="flex-1" style={{ height: '1px', background: 'var(--border)' }} />
      <span className="stamp">{count}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <TopAd />

      {/* Header */}
      <MobileHeader />

      {/* Hero */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="max-w-2xl">
            <div className="stamp mb-5">
              <svg width="7" height="7" viewBox="0 0 7 7" fill="currentColor"><circle cx="3.5" cy="3.5" r="3.5"/></svg>
              100% Free · Anonymous · No watermarks
            </div>
            <h1 className="font-bold mb-4 leading-tight" style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              Every PDF tool<br />
              <span style={{ color: 'var(--accent)' }}>in one place.</span>
            </h1>
            <p className="text-base mb-8 max-w-xl" style={{ color: 'var(--text-muted)' }}>
              Edit, merge, split, compress, rotate, protect, convert PDFs and more.
              No login. No watermarks. Files deleted in 60 minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/merge" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium text-white">
                Get started
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#edit" className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium">
                Browse all tools ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <main className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-14">

        {/* Edit */}
        <section id="edit">
          <SectionHeader title="Edit" count={EDIT_TOOLS.length} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EDIT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>

        {/* Convert */}
        <section id="convert">
          <SectionHeader title="Convert" count={CONVERT_TOOLS.length} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONVERT_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>

        {/* E-Sign */}
        <section id="esign">
          <SectionHeader title="E-Sign" count={ESIGN_TOOLS.length} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ESIGN_TOOLS.map((t) => <ToolCard key={t.id} tool={t} />)}
          </div>
        </section>

        {/* Featured Tech News */}
        <FeaturedNewsSection />

        {/* Made in India tagline */}
        <div
          className="flex flex-col items-center text-center gap-3 py-10 rounded-lg"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2 flex-wrap justify-center" style={{ fontSize: '1.25rem' }}>
            <span>🇮🇳</span>
            <span className="font-bold" style={{ color: 'var(--text)' }}>Made in India,</span>
            <span className="font-bold" style={{ color: 'var(--accent)' }}>Made for the World.</span>
            <span>🌍</span>
          </div>
          <p className="text-xs max-w-md" style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
            Built with love from Uttarakhand — crafted to be fast, free, and accessible to every person, in every country, on every device.
          </p>
        </div>

        {/* Feature strip */}
        <div className="pt-10 grid sm:grid-cols-3 gap-8" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { icon: '🔒', title: 'Private by default', body: 'Files processed server-side and auto-deleted after 60 minutes.' },
            { icon: '⚡', title: 'Powered by real tools', body: 'qpdf, Ghostscript, and pdf-lib for industry-standard processing.' },
            { icon: '∞', title: 'Unlimited & free', body: 'No account needed. No watermarks. No file limits. Just upload and go.' },
          ].map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{f.title}</h4>
                <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomAd />

      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold" style={{ color: 'var(--text)' }}>
            PDF<span style={{ color: 'var(--accent)' }}>.tools</span>
          </span>
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Free · Anonymous · Open source
          </p>
        </div>
      </footer>
    </div>
  );
}