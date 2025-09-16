import { ObjectId } from "mongodb";
import { DocumentRepository } from "../../../shared/Repositories/implementation/DocumentRepository";
import { DocumentResponseDTO } from "../DTOs/DocumentDTO";
import { DocumentNotFoundError } from "../Errors/DocumentErrors";

export class ListDocumentsService {
  constructor(private documentRepository: DocumentRepository) { }

  async execute(): Promise<DocumentResponseDTO[]> {
    const documents = await this.documentRepository.findAll();
    return documents.map(this.mapToResponseDTO);
  }

  async findById(documentId: ObjectId): Promise<DocumentResponseDTO> {
    const document = await this.documentRepository.findById(documentId.toString());

    if (!document) {
      throw new DocumentNotFoundError(documentId.toString());
    }

    return this.mapToResponseDTO(document);
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