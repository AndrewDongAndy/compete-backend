import cfAxios from "./cfAxios";
import { Submission } from "../../common/interfaces/cf/data";

export const fetchSubs = async (): Promise<Submission[]> => {
  try {
    const res = await cfAxios.get("/user.status");
    if (res.data.status != "OK") {
      throw new Error(`Codeforces API returned error: ${res.data.comment}`);
    }
    return res.data.result;
  } catch (err) {
    return [];
  }
};
