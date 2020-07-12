import { Request } from "request";
import { CoreOptions } from "request";

export type CommunityHttpGet = (options: CoreOptions, callback: (err: Error | null, result) => void) => void;

export type CommunityHttpPost = (options: CoreOptions, callback: (err: Error | null, result) => void) => void;
