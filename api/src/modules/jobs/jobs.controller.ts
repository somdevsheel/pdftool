import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, Res, ParseUUIDPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import * as fs from 'fs';
import { JobsService } from './jobs.service';
import {
  MergeJobDto, SplitJobDto, CompressJobDto, RotateJobDto, ConvertJobDto, EditJobDto, PagesJobDto,
  PdfToImgJobDto, OfficeToPdfJobDto, PdfToOfficeJobDto,
  ProtectJobDto, InsertPagesJobDto, NumberPagesJobDto, CropJobDto,
} from '../../common/dto/job.dto';
import { successResponse } from '../../common/utils/response.util';

// Each job runs Ghostscript/LibreOffice/qpdf, so creating jobs is limited much more
// tightly than polling for their status.
const JOB_CREATE_LIMIT = { default: { limit: 20, ttl: 60_000 } };
const UUID_V4 = new ParseUUIDPipe({ version: '4' });

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('jobs/merge')         @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async merge(@Body() dto: MergeJobDto)             { return successResponse(await this.jobsService.createMergeJob(dto)); }
  @Post('jobs/split')         @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async split(@Body() dto: SplitJobDto)             { return successResponse(await this.jobsService.createSplitJob(dto)); }
  @Post('jobs/compress')      @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async compress(@Body() dto: CompressJobDto)       { return successResponse(await this.jobsService.createCompressJob(dto)); }
  @Post('jobs/rotate')        @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async rotate(@Body() dto: RotateJobDto)           { return successResponse(await this.jobsService.createRotateJob(dto)); }
  @Post('jobs/convert')       @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async convert(@Body() dto: ConvertJobDto)         { return successResponse(await this.jobsService.createConvertJob(dto)); }
  @Post('jobs/edit')          @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async edit(@Body() dto: EditJobDto)               { return successResponse(await this.jobsService.createEditJob(dto)); }
  @Post('jobs/pages')         @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async pages(@Body() dto: PagesJobDto)             { return successResponse(await this.jobsService.createPagesJob(dto)); }
  @Post('jobs/pdf-to-img')    @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async pdfToImg(@Body() dto: PdfToImgJobDto)       { return successResponse(await this.jobsService.createPdfToImgJob(dto)); }
  @Post('jobs/office-to-pdf') @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async officeToPdf(@Body() dto: OfficeToPdfJobDto) { return successResponse(await this.jobsService.createOfficeToPdfJob(dto)); }
  @Post('jobs/pdf-to-office') @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async pdfToOffice(@Body() dto: PdfToOfficeJobDto) { return successResponse(await this.jobsService.createPdfToOfficeJob(dto)); }
  @Post('jobs/protect')       @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async protect(@Body() dto: ProtectJobDto)         { return successResponse(await this.jobsService.createProtectJob(dto)); }
  @Post('jobs/insert-pages')  @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async insertPages(@Body() dto: InsertPagesJobDto) { return successResponse(await this.jobsService.createInsertPagesJob(dto)); }
  @Post('jobs/number-pages')  @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async numberPages(@Body() dto: NumberPagesJobDto) { return successResponse(await this.jobsService.createNumberPagesJob(dto)); }
  @Post('jobs/crop')          @Throttle(JOB_CREATE_LIMIT) @HttpCode(HttpStatus.ACCEPTED) async crop(@Body() dto: CropJobDto)               { return successResponse(await this.jobsService.createCropJob(dto)); }

  // There is deliberately no "list all jobs" endpoint: a job ID is the only thing that
  // grants access to its output, so job IDs must never be enumerable.
  @Get('jobs/:id')
  async getJob(@Param('id', UUID_V4) id: string) {
    return successResponse(await this.jobsService.getJob(id));
  }

  @Get('download/:id')
  async download(@Param('id', UUID_V4) id: string, @Res() res: Response) {
    const { filePath, fileName, mimeType } = await this.jobsService.getDownload(id);
    // ASCII fallback plus RFC 5987 UTF-8 name, so non-English file names survive.
    const asciiName = fileName.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', fs.statSync(filePath).size);
    res.setHeader('Cache-Control', 'private, no-store');
    fs.createReadStream(filePath).pipe(res);
  }
}
