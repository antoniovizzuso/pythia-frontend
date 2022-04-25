import { ExportResult } from "./exportresult.model";

export type Result = [
    number,
    string,
    string,
    [string, number, number, number, number, number, number][],
    [string, string, string[], string],
    any,
    string[],
    ExportResult
  ]