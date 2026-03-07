export type ToolId = 'merge' | 'split' | 'compress' | 'rotate' | 'convert' | 'edit';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  route: string;
  acceptedMimeTypes: string[];
  maxFiles: number;
}
