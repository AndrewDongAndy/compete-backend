import assert from "assert";
import { getTable } from "../../util/table";

const TAGS_URL = "https://www.acmicpc.net/problem/tags";

interface Tag {
  tagId: string;
  tagName: string;
  problems: number;
}

export const getTags = async (): Promise<Tag[]> => {
  const { rows } = await getTable(TAGS_URL);
  // console.log("number of tags found:", rows.length);
  const tags: Tag[] = [];
  for (const row of rows) {
    const cells = row.querySelectorAll("td");

    const aTag = cells[1].querySelector("a");
    const url = aTag.getAttribute("href");
    assert(url);

    const tagName = aTag.innerHTML;
    const tagId = url.split("/")[3];
    const problems = +cells[2].innerText;
    tags.push({ tagId, tagName, problems });
  }
  return tags;
};
