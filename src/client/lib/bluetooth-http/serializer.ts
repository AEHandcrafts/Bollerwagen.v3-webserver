import { RequestInfo } from "http-request-mock/src/types";

export function serializeRequest(r: RequestInfo) {
  const body = r.rawBody ? `\n${r.rawBody}\n` : "";
  return `${r.method} ${encodeURI(r.url)} HTTP/1.1\n${[...Object.entries(r.headers!)].map(([k, v]) => `${k}: ${v}`).join("\n")}\n${body}`;
}

export async function serializeResponse(r: Response) {
  return `HTTP/1.1 ${r.status} ${r.statusText}\n${[...r.headers.entries()].map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${await r.text()}\n`;
}
