import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { JobsService } from './jobs.service';
import { DocumentsService } from '../documents/documents.service';
import {
  MergeJobDto, SplitJobDto, CompressJobDto, RotateJobDto, ConvertJobDto, EditJobDto, PagesJobDto,
  PdfToImgJobDto, OfficeToPdfJobDto, PdfToOfficeJobDto,
  ProtectJobDto, InsertPagesJobDto, NumberPagesJobDto, CropJobDto,
} from '../../common/dto/job.dto';
import { successResponse } from '../../common/utils/response.util';

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService, private readonly documentsService: DocumentsService) {}

  @Post('jobs/merge')    @HttpCode(HttpStatus.ACCEPTED) async merge(@Body() dto: MergeJobDto)       { return successResponse(await this.jobsService.createMergeJob(dto)); }
  @Post('jobs/split')    @HttpCode(HttpStatus.ACCEPTED) async split(@Body() dto: SplitJobDto)       { return successResponse(await this.jobsService.createSplitJob(dto)); }
  @Post('jobs/compress') @HttpCode(HttpStatus.ACCEPTED) async compress(@Body() dto: CompressJobDto) { return successResponse(await this.jobsService.createCompressJob(dto)); }
  @Post('jobs/rotate')   @HttpCode(HttpStatus.ACCEPTED) async rotate(@Body() dto: RotateJobDto)     { return successResponse(await this.jobsService.createRotateJob(dto)); }
  @Post('jobs/convert')  @HttpCode(HttpStatus.ACCEPTED) async convert(@Body() dto: ConvertJobDto)   { return successResponse(await this.jobsService.createConvertJob(dto)); }
  @Post('jobs/edit')     @HttpCode(HttpStatus.ACCEPTED) async edit(@Body() dto: EditJobDto)         { return successResponse(await this.jobsService.createEditJob(dto)); }
  @Post('jobs/pages')    @HttpCode(HttpStatus.ACCEPTED) async pages(@Body() dto: PagesJobDto)       { return successResponse(await this.jobsService.createPagesJob(dto)); }
  @Post('jobs/pdf-to-img')    @HttpCode(HttpStatus.ACCEPTED) async pdfToImg(@Body() dto: PdfToImgJobDto)       { return successResponse(await this.jobsService.createPdfToImgJob(dto)); }
  @Post('jobs/office-to-pdf') @HttpCode(HttpStatus.ACCEPTED) async officeToPdf(@Body() dto: OfficeToPdfJobDto) { return successResponse(await this.jobsService.createOfficeToPdfJob(dto)); }
  @Post('jobs/pdf-to-office') @HttpCode(HttpStatus.ACCEPTED) async pdfToOffice(@Body() dto: PdfToOfficeJobDto) { return successResponse(await this.jobsService.createPdfToOfficeJob(dto)); }
  @Post('jobs/protect')       @HttpCode(HttpStatus.ACCEPTED) async protect(@Body() dto: ProtectJobDto)         { return successResponse(await this.jobsService.createProtectJob(dto)); }
  @Post('jobs/insert-pages')  @HttpCode(HttpStatus.ACCEPTED) async insertPages(@Body() dto: InsertPagesJobDto) { return successResponse(await this.jobsService.createInsertPagesJob(dto)); }
  @Post('jobs/number-pages')  @HttpCode(HttpStatus.ACCEPTED) async numberPages(@Body() dto: NumberPagesJobDto) { return successResponse(await this.jobsService.createNumberPagesJob(dto)); }
  @Post('jobs/crop')          @HttpCode(HttpStatus.ACCEPTED) async crop(@Body() dto: CropJobDto)               { return successResponse(await this.jobsService.createCropJob(dto)); }

  @Get('jobs/:id') async getJob(@Param('id') id: string) { return successResponse(await this.jobsService.getJob(id)); }
  @Get('jobs') getAllJobs() { return successResponse(this.jobsService.getAllJobs()); }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const job = await this.jobsService.getJob(id);
    if (job.status !== 'COMPLETED') throw new NotFoundException(`Job ${id} not completed`);
    const base = job.outputPath || '';
    const candidates = [base, `${base}.pdf`, `${base}.jpg`, `${base}.png`, `${base}.zip`, `${base}.docx`, `${base}.pptx`, `${base}.xlsx`];
    const resolved = candidates.find(p => p && fs.existsSync(p));
    if (!resolved) throw new NotFoundException(`Output file not found for job ${id}`);
    const ext = (resolved.match(/\.(pdf|zip|jpg|jpeg|png|docx|pptx|xlsx)$/i) || [])[1]?.toLowerCase() || 'pdf';
    const mime: Record<string,string> = {
      pdf:'application/pdf', zip:'application/zip', jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png',
      docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    res.setHeader('Content-Disposition', `attachment; filename="${job.type}-${id}.${ext}"`);
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', fs.statSync(resolved).size);
    fs.createReadStream(resolved).pipe(res);
  }
}