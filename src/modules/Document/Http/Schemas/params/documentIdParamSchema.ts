import { Static, Type } from "@sinclair/typebox";

export const documentIdParamSchema = Type.Object({
  id: Type.String({ minLength: 24, maxLength: 24 })
});

export type DocumentIdParamType = Static<typeof documentIdParamSchema>;