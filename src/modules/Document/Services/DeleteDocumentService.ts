import { ObjectId } from "mongodb";
import { DocumentRepository } from "../../../shared/Repositories/implementation/DocumentRepository";
import { DocumentNotFoundError } from "../Errors/DocumentErrors";

export class DeleteDocumentService {
  constructor(private documentRepository: DocumentRepository) { }

  async execute(documentId: ObjectId): Promise<void> {
    const existingDocument = await this.documentRepository.findById(documentId.toString());

    if (!existingDocument) {
      throw new DocumentNotFoundError(documentId.toString());
    }

    await this.documentRepository.delete(documentId.toString());
  }
}