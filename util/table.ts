import { HTMLElement } from "node-html-parser";
import { getParsedHtml } from "./getHtml";

export interface Table {
  headings: HTMLElement[]; // <th> elements
  rows: HTMLElement[]; // <tr> elements
}

export const parseTable = (table: HTMLElement): Table => {
  const headings = table.querySelectorAll("thead > th");
  const rows = table.querySelectorAll("tbody > tr");
  return {
    headings,
    rows,
  };
};

export const getTable = async (
  url: string,
  selector = "table"
): Promise<Table> => {
  const html = await getParsedHtml(url);
  const table = html.querySelector(selector);
  return parseTable(table);
};
