import { Static, Type } from "@sinclair/typebox";

export const updateUserBodySchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1 })),
  email: Type.Optional(Type.String({ format: "email" })),
  demolayId: Type.Optional(Type.Number()),
  roles: Type.Optional(Type.Array(Type.Union([Type.Literal("user"), Type.Literal("manager"), Type.Literal("corretor")]))),
  permissions: Type.Optional(Type.Array(Type.String())),
  status: Type.Optional(Type.Union([Type.Literal("active"), Type.Literal("inactive"), Type.Literal("blocked")])),
  settings: Type.Optional(
    Type.Object({
      theme: Type.Union([Type.Literal("light"), Type.Literal("dark")]),
      language: Type.String({ minLength: 2 })
    })
  )
});

export type UpdateUserBodyType = Static<typeof updateUserBodySchema>;