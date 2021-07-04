import assert from "assert";
import { HTMLElement } from "node-html-parser";
import { getParsedHtml } from "../../util/getHtml";

const ACCEPTED_HEADING = "맞은 문제";
const PARTIAL_HEADING = "맞았지만 만점을 받지 못한 문제";
const WRONG_HEADING = "시도했지만 맞지 못한 문제";

const userUrl = (bojId: string) => {
  return `https://www.acmicpc.net/user/${bojId}`;
};

interface UserSolves {
  accepted: string[];
  partial: string[];
  wrong: string[];
}

export const getUserSolves = async (
  bojId: string
): Promise<UserSolves | null> => {
  let html: HTMLElement;
  try {
    html = await getParsedHtml(userUrl(bojId));
  } catch (err) {
    // axios fetch error
    assert(err.response.status == 404);
    return null;
  }
  const res: UserSolves = { accepted: [], partial: [], wrong: [] };

  const panels = html.querySelectorAll(".panel.panel-default");
  if (panels.length == 0) {
    return null;
  }
  for (const panel of panels) {
    const title = panel.querySelector(".panel-title").innerText;
    const aTags = panel.querySelectorAll(".panel-body > a");
    const problemIds = aTags.map((aTag) => aTag.innerText);
    if (title == ACCEPTED_HEADING) {
      res.accepted = problemIds;
    } else if (title == PARTIAL_HEADING) {
      res.partial = problemIds;
    } else if (title == WRONG_HEADING) {
      res.wrong = problemIds;
    } else {
      console.error("another heading was found on user page:", bojId);
    }
  }
  return res;
};
