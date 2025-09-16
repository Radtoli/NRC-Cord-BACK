import { Static, Type } from "@sinclair/typebox";

export const userIdParamSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 }) // ObjectId length
});

export type UserIdParamType = Static<typeof userIdParamSchema>;