import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MergeJobDto {
  @IsArray()
  @IsNotEmpty()
  fileIds: string[];
}

export class SplitJobDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsOptional()
  pages?: string; // e.g. "1-3,5,7-9"
}

export class CompressJobDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  quality?: 'low' | 'medium' | 'high';
}

export class RotateJobDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsOptional()
  pages?: number[];

  @IsOptional()
  degrees?: 90 | 180 | 270;
}

export class EditJobDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsOptional()
  instructions?: EditInstruction[];
}

export class PagesJobDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  operation: 'delete' | 'extract' | 'reorder' | 'organize';

  @IsArray()
  pages: number[];
}

export interface EditInstruction {
  type: 'text' | 'annotation' | 'rotate';
  page: number;
  x?: number;
  y?: number;
  content?: string;
  fontSize?: number;
  color?: string;
  degrees?: number;
}
