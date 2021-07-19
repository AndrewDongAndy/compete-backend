export interface Contest {
  id: number;
  name: string;
  type: "CF" | "IOI" | "ICPC"; // scoring system
  phase:
    | "BEFORE"
    | "CODING"
    | "PENDING_SYSTEM_TEST"
    | "SYSTEM_TEST"
    | "FINISHED";
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
  // there's some more stuff:
  // https://codeforces.com/apiHelp/objects#Contest
  description?: string;
}

export interface Problem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: "PROGRAMMING" | "QUESTION";
  points?: number;
  rating?: number; // difficulty
  tags: string[];
}

export interface Member {
  handle: string;
}

export interface Party {
  contestId: number;
  members: Member[];
  participantType:
    | "CONTESTANT"
    | "PRACTICE"
    | "VIRTUAL"
    | "MANAGER"
    | "OUT_OF_COMPETITION";
  teamId?: number;
  teamName?: string;
  ghost: boolean;
  // If true then this party is a ghost. It participated in the contest,
  // but not on Codeforces. For example, Andrew Stankevich Contests in
  // Gym has ghosts of the participants from Petrozavodsk Training Camp.
  room?: number;
  startTimeSeconds?: number;
}

export interface Submission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: Problem;
  author: Party;
  programmingLanguage: string;
  verdict:
    | "FAILED"
    | "OK"
    | "PARTIAL"
    | "COMPILATION_ERROR"
    | "RUNTIME_ERROR"
    | "WRONG_ANSWER"
    | "PRESENTATION_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "IDLENESS_LIMIT_EXCEEDED"
    | "SECURITY_VIOLATED"
    | "CRASHED"
    | "INPUT_PREPARATION_CRASHED"
    | "CHALLENGED"
    | "SKIPPED"
    | "TESTING"
    | "REJECTED";
  testset:
    | "SAMPLES"
    | "PRETESTS"
    | "TESTS"
    | "CHALLENGES"
    | "TESTS1"
    | "TESTS2"
    | "TESTS3"
    | "TESTS4"
    | "TESTS5"
    | "TESTS6"
    | "TESTS7"
    | "TESTS8"
    | "TESTS9"
    | "TESTS10";
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}
