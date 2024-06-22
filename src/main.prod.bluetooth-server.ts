import { initApp } from "./server/main";
import http, { ServerOptions } from "node:http";
import { serve } from "@hono/node-server";
import { Server } from "https";

const listeners = [];

function req(http: string) {
  for (const l of listeners) l(http);
}

function createServer<
  Request extends typeof http.IncomingMessage = typeof http.IncomingMessage,
  Response extends typeof http.ServerResponse = typeof http.ServerResponse,
>(options: ServerOptions, requestListener?: http.RequestListener<Request, Response>): Server<Request, Response> {
  return {
    listen(port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): this {
      console.log("io-http-server: listen", port, hostname, backlog, listeningListener);
      listeners.push(requestListener);
    },
  };
}

const app = initApp(process.env);
serve({ fetch: app.fetch, port: 5174, createServer });

req(
  "GET /foo/bar HTTP/1.1\n" +
    "Host: example.org\n" +
    "User-Agent: Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; fr; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8\n" +
    "Accept: */*\n" +
    "Accept-Language: fr,fr-fr;q=0.8,en-us;q=0.5,en;q=0.3\n" +
    "Accept-Encoding: gzip,deflate\n" +
    "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7\n" +
    "Keep-Alive: 115\n" +
    "Connection: keep-alive\n" +
    "Content-Type: application/x-www-form-urlencoded\n" +
    "X-Requested-With: XMLHttpRequest\n" +
    "Referer: http://example.org/test\n" +
    "Cookie: foo=bar; lorem=ipsum;",
);
