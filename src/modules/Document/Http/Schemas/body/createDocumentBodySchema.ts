import { Static, Type } from "@sinclair/typebox";

export const createDocumentBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  type: Type.Union([
    Type.Literal("pdf"),
    Type.Literal("doc"),
    Type.Literal("ppt"),
    Type.Literal("xlsx")
  ]),
  url: Type.String({ format: "uri" }),
  size: Type.String({ minLength: 1 }),
  video: Type.String({ minLength: 24, maxLength: 24 }) // ObjectId
});

export type CreateDocumentBodyType = Static<typeof createDocumentBodySchema>;