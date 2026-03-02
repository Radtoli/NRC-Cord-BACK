import { FastifyRequest, FastifyReply } from 'fastify';
import { pipeline } from 'stream/promises';
import { container } from '../../../../shared/infra/containers';
import { UploadService } from '../../services/UploadService';

function getUploadService() {
  return container.resolve<UploadService>('avaUploadService');
}

export async function uploadFileHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await req.file();

    if (!data) {
      return reply.status(400).send({ success: false, error: 'No file provided' });
    }

    // Read buffer from multipart stream
    const chunks: Uint8Array[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const uploadService = getUploadService();
    const fileRecord = await uploadService.saveFile({
      buffer,
      originalName: data.filename,
      mimeType: data.mimetype,
      sizeBytes: buffer.byteLength,
      uploadedBy: (req as any).user?._id?.toString(),
    });

    return reply.status(201).send({
      success: true,
      data: {
        id: fileRecord.id,
        url: fileRecord.fileUrl,
        fileName: fileRecord.fileName,
        originalName: fileRecord.originalName,
        mimeType: fileRecord.mimeType,
        sizeBytes: fileRecord.sizeBytes,
        provider: fileRecord.provider,
      },
    });
  } catch (err: any) {
    if (err.message.includes('not allowed') || err.message.includes('too large')) {
      return reply.status(400).send({ success: false, error: err.message });
    }
    return reply.status(500).send({ success: false, error: 'Upload failed' });
  }
}
