import { Static, Type } from "@sinclair/typebox";

export const createDocumentBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  type: Type.Union([
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
  ]),
  url: Type.String({ minLength: 1 }), // Remover format: "uri" para ser mais flexível
  size: Type.String({ minLength: 1 }),
  video: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })) // ObjectId opcional
});

export type CreateDocumentBodyType = Static<typeof createDocumentBodySchema>;