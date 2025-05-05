// A simpler, more direct approach to R2 integration
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// R2 configuration using environment variables
const r2Config = {
  endpoint: `https://${process.env.R2_ACCOUNT_ID || ''}.r2.cloudflarestorage.com`,
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucket: process.env.R2_BUCKET || 'tattoo',
  publicUrl: process.env.R2_PUBLIC_URL || ''
};

// Initialize the S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: r2Config.endpoint,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});

export async function uploadFileToR2(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    console.log(`[DIRECT R2] Uploading file: ${fileName}, type: ${contentType}, size: ${file.length} bytes`);
    
    const command = new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    const response = await s3Client.send(command);
    console.log(`[DIRECT R2] Upload response:`, response);
    
    const fileUrl = `${r2Config.publicUrl}/${fileName}`;
    console.log(`[DIRECT R2] File URL: ${fileUrl}`);
    
    return fileUrl;
  } catch (error) {
    console.error('[DIRECT R2] Upload error:', error);
    throw error;
  }
}
