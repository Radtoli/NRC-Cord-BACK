import { Static, Type } from "@sinclair/typebox";

export const updateDocumentBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1 })),
  type: Type.Optional(Type.Union([
    Type.Literal("pdf"),
    Type.Literal("doc"),
    Type.Literal("docx"),
    Type.Literal("ppt"),
    Type.Literal("pptx"),
    Type.Literal("xls"),
    Type.Literal("xlsx"),
    Type.Literal("txt"),
    Type.Literal("md"),
    Type.Literal("html"),
    Type.Literal("zip"),
    Type.Literal("rar"),
    Type.Literal("outros")
  ])),
  url: Type.Optional(Type.String({ minLength: 1 })), // Remover format: "uri" para ser mais flexível
  size: Type.Optional(Type.String({ minLength: 1 })),
  video: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })) // ObjectId
});

export type UpdateDocumentBodyType = Static<typeof updateDocumentBodySchema>;