export class DocumentNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Document with id '${id}' not found` : 'Document not found');
    this.name = 'DocumentNotFoundError';
  }
}

export class InvalidDocumentDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDocumentDataError';
  }
}