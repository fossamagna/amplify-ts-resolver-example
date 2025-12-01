import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { build } from "./build-helper";

const schema = a.schema({
  Post: a
    .model({
      content: a.string(),
      likes: a
        .integer()
        .authorization((allow) => [allow.authenticated().to(["read"])]),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(["read"]),
    ]),

  likePost: a
    .mutation()
    .arguments({ postId: a.id() })
    .returns(a.ref("Post"))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        dataSource: a.ref("Post"),
        entry: build("./resolvers/increment-like.ts"),
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
