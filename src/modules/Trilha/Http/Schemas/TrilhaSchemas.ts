import { Static, Type } from "@sinclair/typebox";

export const createTrilhaBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
  videos: Type.Optional(Type.Array(Type.String({ minLength: 24, maxLength: 24 }))), // Array de ObjectIds
  courseId: Type.Optional(Type.String())
});

export const updateTrilhaBodySchema = Type.Object({
  title: Type.Optional(Type.String({ minLength: 1 })),
  description: Type.Optional(Type.String()),
  videos: Type.Optional(Type.Array(Type.String({ minLength: 24, maxLength: 24 }))), // Array de ObjectIds
  courseId: Type.Optional(Type.Union([Type.String(), Type.Null()]))
});

export const trilhaIdParamSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 }) // ObjectId length
});

export type CreateTrilhaBodyType = Static<typeof createTrilhaBodySchema>;
export type UpdateTrilhaBodyType = Static<typeof updateTrilhaBodySchema>;
export type TrilhaIdParamType = Static<typeof trilhaIdParamSchema>;