import { helper } from "./helper";
import { Env } from "./env";
import { eventBus } from "./eventBus";

export const utils = {
  helper,
  env: new Env(),
  eventBus,
};
