import { Type } from 'class-transformer';
import {
  ArrayMaxSize, ArrayMinSize, IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString,
  IsUUID, Matches, Max, MaxLength, Min, ValidateNested,
} from 'class-validator';

// Every value here ends up as an argument to qpdf/ghostscript/LibreOffice/mutool in the
// worker, so each field is validated to exactly the shape the tools expect.

const MAX_FILES = 50;
const MAX_PAGES = 10_000;
// qpdf page-range syntax as typed by users: "1-3, 5, 7-z"
const PAGE_RANGE = /^\s*[1-9]\d*(\s*-\s*([1-9]\d*|z))?(\s*,\s*[1-9]\d*(\s*-\s*([1-9]\d*|z))?)*\s*$/;

export class MergeJobDto {
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(MAX_FILES) @IsUUID('4', { each: true })
  fileIds: string[];
}

export class SplitJobDto {
  @IsUUID('4') fileId: string;
  @IsOptional() @IsString() @MaxLength(500)
  @Matches(PAGE_RANGE, { message: 'Enter pages like "1-3, 5, 7-9" (numbers, commas and hyphens only).' })
  pages?: string;
}

export class CompressJobDto {
  @IsUUID('4') fileId: string;
  @IsOptional() @IsIn(['low', 'medium', 'high']) quality?: 'low' | 'medium' | 'high';
}

export class RotateJobDto {
  @IsUUID('4') fileId: string;
  @IsOptional() @IsArray() @ArrayMaxSize(MAX_PAGES) @IsInt({ each: true }) @Min(1, { each: true })
  pages?: number[];
  @IsOptional() @IsIn([90, 180, 270]) degrees?: 90 | 180 | 270;
}

export class ConvertJobDto {
  @IsOptional() @IsArray() @ArrayMaxSize(MAX_FILES) @IsUUID('4', { each: true })
  fileIds?: string[];
  @IsOptional() @IsUUID('4') fileId?: string;
}

export class EditInstructionDto {
  @IsIn(['text', 'annotation', 'rotate']) type: 'text' | 'annotation' | 'rotate';
  @IsInt() @Min(1) @Max(MAX_PAGES) page: number;
  @IsOptional() @IsNumber() @Min(-10_000) @Max(10_000) x?: number;
  @IsOptional() @IsNumber() @Min(-10_000) @Max(10_000) y?: number;
  @IsOptional() @IsString() @MaxLength(5_000) content?: string;
  @IsOptional() @IsString() @MaxLength(5_000) originalText?: string;
  @IsOptional() @IsNumber() @Min(1) @Max(200) fontSize?: number;
  @IsOptional() @Matches(/^#[0-9a-fA-F]{6}$/) color?: string;
  @IsOptional() @IsIn([90, 180, 270]) degrees?: number;
}

export class EditJobDto {
  @IsUUID('4') fileId: string;
  @IsOptional() @IsArray() @ArrayMaxSize(500)
  @ValidateNested({ each: true }) @Type(() => EditInstructionDto)
  instructions?: EditInstructionDto[];
}

export class PagesJobDto {
  @IsUUID('4') fileId: string;
  @IsIn(['delete', 'extract', 'reorder', 'organize']) operation: 'delete' | 'extract' | 'reorder' | 'organize';
  @IsArray() @ArrayMaxSize(MAX_PAGES) @IsInt({ each: true }) @Min(1, { each: true })
  pages: number[];
}

export class PdfToImgJobDto {
  @IsUUID('4') fileId: string;
  @IsOptional() @IsIn(['jpg', 'png']) format?: 'jpg' | 'png';
  @IsOptional() @IsInt() @Min(72) @Max(300) dpi?: number;
}

export class OfficeToPdfJobDto { @IsUUID('4') fileId: string; }

export class PdfToOfficeJobDto {
  @IsUUID('4') fileId: string;
  @IsIn(['docx', 'pptx', 'xlsx']) format: 'docx' | 'pptx' | 'xlsx';
}

export class ProtectJobDto {
  @IsUUID('4') fileId: string;
  // AES-256 only uses the first 127 bytes of a password; cap well below that.
  @IsString() @IsNotEmpty() @MaxLength(100) userPassword: string;
  @IsOptional() @IsString() @MaxLength(100) ownerPassword?: string;
}

export class InsertPagesJobDto {
  @IsUUID('4') baseFileId: string;
  @IsUUID('4') insertFileId: string;
  @IsInt() @Min(0) @Max(MAX_PAGES) afterPage: number;
}

export class NumberPagesJobDto {
  @IsUUID('4') fileId: string;
  @IsOptional() @IsIn(['bottom-center', 'bottom-right', 'bottom-left', 'top-center', 'top-right', 'top-left'])
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  @IsOptional() @IsInt() @Min(1) @Max(1_000_000) startNumber?: number;
  @IsOptional() @IsNumber() @Min(6) @Max(72) fontSize?: number;
}

export class CropJobDto {
  @IsUUID('4') fileId: string;
  @IsNumber() @Min(0) @Max(10_000) top: number;
  @IsNumber() @Min(0) @Max(10_000) bottom: number;
  @IsNumber() @Min(0) @Max(10_000) left: number;
  @IsNumber() @Min(0) @Max(10_000) right: number;
}

export type EditInstruction = EditInstructionDto;
