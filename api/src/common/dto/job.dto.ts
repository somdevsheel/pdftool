import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class MergeJobDto { @IsArray() @IsNotEmpty() fileIds: string[]; }
export class SplitJobDto { @IsString() @IsNotEmpty() fileId: string; @IsOptional() pages?: string; }
export class CompressJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsOptional() @IsEnum(['low','medium','high']) quality?: 'low'|'medium'|'high';
}
export class RotateJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsOptional() pages?: number[];
  @IsOptional() degrees?: 90|180|270;
}
export class ConvertJobDto {
  @IsArray() fileIds: string[];
  @IsOptional() @IsString() fileId?: string;
}
export class EditJobDto { @IsString() @IsNotEmpty() fileId: string; @IsOptional() instructions?: EditInstruction[]; }
export class PagesJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsString() @IsNotEmpty() operation: 'delete'|'extract'|'reorder'|'organize';
  @IsArray() pages: number[];
}
export class PdfToImgJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsOptional() @IsEnum(['jpg','png']) format?: 'jpg'|'png';
  @IsOptional() dpi?: number;
}
export class OfficeToPdfJobDto { @IsString() @IsNotEmpty() fileId: string; }
export class PdfToOfficeJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsString() @IsNotEmpty() @IsEnum(['docx','pptx','xlsx']) format: 'docx'|'pptx'|'xlsx';
}
export class ProtectJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsString() @IsNotEmpty() userPassword: string;
  @IsOptional() @IsString() ownerPassword?: string;
}
export class InsertPagesJobDto {
  @IsString() @IsNotEmpty() baseFileId: string;
  @IsString() @IsNotEmpty() insertFileId: string;
  @IsNumber() @Min(0) afterPage: number;
}
export class NumberPagesJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsOptional() @IsEnum(['bottom-center','bottom-right','bottom-left','top-center','top-right','top-left'])
  position?: 'bottom-center'|'bottom-right'|'bottom-left'|'top-center'|'top-right'|'top-left';
  @IsOptional() @IsNumber() @Min(1) startNumber?: number;
  @IsOptional() @IsNumber() fontSize?: number;
}
export class CropJobDto {
  @IsString() @IsNotEmpty() fileId: string;
  @IsNumber() top: number;
  @IsNumber() bottom: number;
  @IsNumber() left: number;
  @IsNumber() right: number;
}

export interface EditInstruction {
  type: 'text'|'annotation'|'rotate'; page: number;
  x?: number; y?: number; content?: string; fontSize?: number; color?: string; degrees?: number;
}