import CATEGORIES from "./categories";
import { randChoice } from "../util/random";
import {
  getUserCategories,
  setUserCategories,
} from "../models/redis/categories";

const TAGS_PER_DAY = 4;

export const getCategoriesForDay = async (
  username: string
): Promise<number[]> => {
  let tags = await getUserCategories(username);
  if (tags.length == 0) {
    const indices = Array<number>(CATEGORIES.length);
    for (let i = 0; i < CATEGORIES.length; i++) {
      indices[i] = i;
    }
    tags = randChoice(indices, TAGS_PER_DAY);
    await setUserCategories(username, tags);
  }
  // send tags in alphabetical order
  tags.sort((x, y) => {
    const nameX = CATEGORIES[x].displayName;
    const nameY = CATEGORIES[y].displayName;
    return nameX < nameY ? -1 : +1;
  });
  return tags;
};
