import { Static, Type } from "@sinclair/typebox";

export const changePasswordBodySchema = Type.Object({
  currentPassword: Type.String({ minLength: 1 }),
  newPassword: Type.String({ minLength: 6 })
});

export type ChangePasswordBodyType = Static<typeof changePasswordBodySchema>;