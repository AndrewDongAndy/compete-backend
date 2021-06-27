import axios from "axios";
import { HTMLElement, parse as parseHtml } from "node-html-parser";

export const getParsedHtml = async (url: string): Promise<HTMLElement> => {
  const res = await axios.get(url);
  return parseHtml(res.data);
};
