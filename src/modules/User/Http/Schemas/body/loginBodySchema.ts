import { Static, Type } from "@sinclair/typebox";

export const loginBodySchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 1 })
});

export type LoginBodyType = Static<typeof loginBodySchema>;