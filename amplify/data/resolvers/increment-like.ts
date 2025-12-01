import { type Context, util } from "@aws-appsync/utils";
import type { Schema } from "../resource";

type Args = Schema["likePost"]["args"];
type Result = Schema["likePost"]["returnType"];
type Stash = Record<string, never>;
type Pre = Record<string, never>;
type Source = Record<string, never>;

export function request(ctx: Context<Args, Stash, Pre, Source, Result>) {
  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({ id: ctx.args.postId }),
    update: {
      expression: "ADD likes :plusOne",
      expressionValues: { ":plusOne": { N: 1 } },
    },
  };
}

export function response(ctx: Context<Args, Stash, Pre, Source, Result>) {
  return ctx.result;
}
