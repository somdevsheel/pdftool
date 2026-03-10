import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // Disable automatic checksum — prevents x-amz-checksum-crc32 being added
  // to presigned URLs which causes CORS preflight to fail
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

const BUCKET = process.env.S3_BUCKET_NAME!;
const CF_DOMAIN = process.env.CLOUDFRONT_DOMAIN!;

export async function getPresignedUploadUrl(fileType: string, folder = 'news') {
  const ext = fileType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const key = `${folder}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
    CacheControl: 'max-age=31536000',
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { url, key };
}

export async function deleteS3Object(key: string) {
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
  await s3.send(command);
}

export function getCloudFrontUrl(key: string): string {
  return `${CF_DOMAIN}/${key}`;
}
