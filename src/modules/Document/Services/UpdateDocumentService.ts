import { ObjectId } from "mongodb";
import { DocumentRepository } from "../../../shared/Repositories/implementation/DocumentRepository";
import { UpdateDocumentDTO, DocumentResponseDTO } from "../DTOs/DocumentDTO";
import { DocumentNotFoundError, InvalidDocumentDataError } from "../Errors/DocumentErrors";

export class UpdateDocumentService {
  constructor(private documentRepository: DocumentRepository) { }

  async execute(documentId: ObjectId, data: UpdateDocumentDTO): Promise<DocumentResponseDTO> {
    const existingDocument = await this.documentRepository.findById(documentId.toString());

    if (!existingDocument) {
      throw new DocumentNotFoundError(documentId.toString());
    }

    this.validateDocumentData(data);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.size !== undefined) updateData.size = data.size;
    if (data.video !== undefined) updateData.video = data.video;

    const updatedDocument = await this.documentRepository.update(documentId.toString(), updateData);

    return this.mapToResponseDTO(updatedDocument);
  }

  private validateDocumentData(data: UpdateDocumentDTO): void {
    if (data.title !== undefined && !data.title.trim()) {
      throw new InvalidDocumentDataError('Title cannot be empty');
    }

    if (data.type !== undefined && !['pdf', 'doc', 'ppt', 'xlsx'].includes(data.type)) {
      throw new InvalidDocumentDataError('Invalid document type');
    }

    if (data.url !== undefined && !data.url.trim()) {
      throw new InvalidDocumentDataError('URL cannot be empty');
    }

    if (data.size !== undefined && !data.size.trim()) {
      throw new InvalidDocumentDataError('Size cannot be empty');
    }
  }

  private mapToResponseDTO(document: any): DocumentResponseDTO {
    return {
      _id: document._id,
      title: document.title,
      type: document.type,
      url: document.url,
      size: document.size,
      video: document.video,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }
}