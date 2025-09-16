import { Static, Type } from "@sinclair/typebox";

export const updateDocumentBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1 })),
  type: Type.Optional(Type.Union([
    Type.Literal("pdf"),
    Type.Literal("doc"),
    Type.Literal("ppt"),
    Type.Literal("xlsx")
  ])),
  url: Type.Optional(Type.String({ format: "uri" })),
  size: Type.Optional(Type.String({ minLength: 1 })),
  video: Type.Optional(Type.String({ minLength: 24, maxLength: 24 })) // ObjectId
});

export type UpdateDocumentBodyType = Static<typeof updateDocumentBodySchema>;