import { messagesJoin, itemsJoin } from "./join.utils";

export function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

export { messagesJoin, itemsJoin };
