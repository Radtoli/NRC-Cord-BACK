import { ObjectId } from "mongodb";
import { DocumentRepository } from "../../../shared/Repositories/implementation/DocumentRepository";
import { CreateDocumentDTO, DocumentResponseDTO } from "../DTOs/DocumentDTO";
import { InvalidDocumentDataError } from "../Errors/DocumentErrors";

export class CreateDocumentService {
  constructor(private documentRepository: DocumentRepository) { }

  async execute(data: CreateDocumentDTO): Promise<DocumentResponseDTO> {
    this.validateDocumentData(data);

    const documentData = {
      title: data.title,
      type: data.type,
      url: data.url,
      size: data.size,
      video: data.video || undefined
    };

    const document = await this.documentRepository.create(documentData);

    return this.mapToResponseDTO(document);
  }

  private validateDocumentData(data: CreateDocumentDTO): void {
    if (!data.title.trim()) {
      throw new InvalidDocumentDataError('Title cannot be empty');
    }

    if (!['pdf', 'doc', 'ppt', 'xlsx'].includes(data.type)) {
      throw new InvalidDocumentDataError('Invalid document type');
    }

    if (!data.url.trim()) {
      throw new InvalidDocumentDataError('URL cannot be empty');
    }

    if (!data.size.trim()) {
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