import { HTTPParser } from "http-parser-js";

export function parseRequest(inputString: string): Request {
  const input = Buffer.from(inputString);
  const parser = new HTTPParser(HTTPParser.REQUEST);
  let complete = false;
  let shouldKeepAlive;
  let upgrade;
  let method;
  let url;
  let versionMajor;
  let versionMinor;
  const headers: NodeJS.Dict<string | string[]> = {};
  const trailers: NodeJS.Dict<string> = {};
  const bodyChunks: any[] = [];

  parser[HTTPParser.kOnHeadersComplete] = function (req) {
    shouldKeepAlive = req.shouldKeepAlive;
    upgrade = req.upgrade;
    method = HTTPParser.methods[req.method];
    url = req.url;
    versionMajor = req.versionMajor;
    versionMinor = req.versionMinor;
    // @ts-ignore
    for (let i = 0; i < req.headers.length; i += 2) headers[req.headers[i]] = req.headers[i + 1];
  };

  parser[HTTPParser.kOnBody] = function (chunk, offset, length) {
    bodyChunks.push(chunk.slice(offset, offset + length));
  };

  parser[HTTPParser.kOnHeaders] = function (t) {
    // @ts-ignore
    for (let i = 0; i < t.length; i += 2) trailers[t[i]] = t[i + 1];
  };

  parser[HTTPParser.kOnMessageComplete] = function () {
    complete = true;
  };

  parser.execute(input);
  parser.finish();

  if (!complete) {
    throw new Error("Could not parse request");
  }

  const body: Buffer = Buffer.concat(bodyChunks);

  return new Request(url!);
}

export function parseResponse(inputString: string): Response {
  const input = Buffer.from(inputString);
  const parser = new HTTPParser(HTTPParser.RESPONSE);
  let complete = false;
  let shouldKeepAlive;
  let upgrade;
  let statusCode;
  let statusMessage;
  let versionMajor;
  let versionMinor;
  const headers: Headers = new Headers();
  let trailers = [];
  const bodyChunks: any[] = [];

  parser[HTTPParser.kOnHeadersComplete] = function (res) {
    shouldKeepAlive = res.shouldKeepAlive;
    upgrade = res.upgrade;
    statusCode = res.statusCode;
    statusMessage = res.statusMessage;
    versionMajor = res.versionMajor;
    versionMinor = res.versionMinor;
    // @ts-ignore
    for (let i = 0; i < res.headers.length; i += 2) headers[res.headers[i]] = res.headers[i + 1];
  };

  parser[HTTPParser.kOnBody] = function (chunk, offset, length) {
    bodyChunks.push(chunk.slice(offset, offset + length));
  };

  // This is actually the event for trailers, go figure.
  parser[HTTPParser.kOnHeaders] = function (t) {
    trailers = t;
  };

  parser[HTTPParser.kOnMessageComplete] = function () {
    complete = true;
  };

  // Since we are sending the entire Buffer at once here all callbacks above happen synchronously.
  // The parser does not do _anything_ asynchronous.
  // However, you can of course call execute() multiple times with multiple chunks, e.g. from a stream.
  // But then you have to refactor the entire logic to be async (e.g. resolve a Promise in kOnMessageComplete and add timeout logic).
  parser.execute(input);
  parser.finish();

  if (!complete) {
    throw new Error("Could not parse");
  }

  const body = Buffer.concat(bodyChunks).toString();

  return new Response(body, { status: statusCode, statusText: statusMessage, headers });
}
