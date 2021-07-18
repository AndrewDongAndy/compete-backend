import { PlatformName } from "../../common/interfaces/platforms";
import { Platform } from "./Platform";
import boj from "./boj";
import cf from "./cf";

const map = new Map<PlatformName, Platform>([
  ["boj", boj],
  ["cf", cf],
]);

export const getPlatform = (name: PlatformName): Platform => {
  const platform = map.get(name);
  if (!platform) {
    throw new Error(`platform ${name} does not exist`);
  }
  return platform;
};
