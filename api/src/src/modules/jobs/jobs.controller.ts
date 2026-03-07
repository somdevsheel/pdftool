import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { JobsService } from './jobs.service';
import { DocumentsService } from '../documents/documents.service';
import {
  MergeJobDto,
  SplitJobDto,
  CompressJobDto,
  RotateJobDto,
  EditJobDto,
  PagesJobDto,
} from '../../common/dto/job.dto';
import { successResponse } from '../../common/utils/response.util';

@Controller()
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly documentsService: DocumentsService,
  ) {}

  // ─── Job Creation ─────────────────────────────────────────────────────────

  @Post('jobs/merge')
  @HttpCode(HttpStatus.ACCEPTED)
  async merge(@Body() dto: MergeJobDto) {
    const job = await this.jobsService.createMergeJob(dto);
    return successResponse(job, 'Merge job queued');
  }

  @Post('jobs/split')
  @HttpCode(HttpStatus.ACCEPTED)
  async split(@Body() dto: SplitJobDto) {
    const job = await this.jobsService.createSplitJob(dto);
    return successResponse(job, 'Split job queued');
  }

  @Post('jobs/compress')
  @HttpCode(HttpStatus.ACCEPTED)
  async compress(@Body() dto: CompressJobDto) {
    const job = await this.jobsService.createCompressJob(dto);
    return successResponse(job, 'Compress job queued');
  }

  @Post('jobs/rotate')
  @HttpCode(HttpStatus.ACCEPTED)
  async rotate(@Body() dto: RotateJobDto) {
    const job = await this.jobsService.createRotateJob(dto);
    return successResponse(job, 'Rotate job queued');
  }

  @Post('jobs/edit')
  @HttpCode(HttpStatus.ACCEPTED)
  async edit(@Body() dto: EditJobDto) {
    const job = await this.jobsService.createEditJob(dto);
    return successResponse(job, 'Edit job queued');
  }

  @Post('jobs/pages')
  @HttpCode(HttpStatus.ACCEPTED)
  async pages(@Body() dto: PagesJobDto) {
    const job = await this.jobsService.createPagesJob(dto);
    return successResponse(job, 'Pages job queued');
  }

  // ─── Job Status ───────────────────────────────────────────────────────────

  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    const job = await this.jobsService.getJob(id);
    return successResponse(job);
  }

  @Get('jobs')
  getAllJobs() {
    const jobs = this.jobsService.getAllJobs();
    return successResponse(jobs);
  }

  // ─── Download ─────────────────────────────────────────────────────────────

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const job = await this.jobsService.getJob(id);

    if (job.status !== 'COMPLETED') {
      throw new NotFoundException(`Job ${id} is not completed (status: ${job.status})`);
    }

    if (!job.outputPath || !fs.existsSync(job.outputPath)) {
      throw new NotFoundException(`Output file for job ${id} not found`);
    }

    const extMatch = job.outputPath.match(/\.(zip|pdf|jpg|jpeg|png|docx|pptx|xlsx)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'pdf';
    const mimeMap: Record<string, string> = {
      zip:  'application/zip',
      pdf:  'application/pdf',
      jpg:  'image/jpeg',
      jpeg: 'image/jpeg',
      png:  'image/png',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    const filename = `${job.type}-${id}.${ext}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', fs.statSync(job.outputPath).size);

    const stream = fs.createReadStream(job.outputPath);
    stream.pipe(res);
  }
}
