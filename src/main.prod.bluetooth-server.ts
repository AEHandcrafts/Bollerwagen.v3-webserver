import { initApp } from "./server/main";
import { serializeResponse } from "./client/lib/bluetooth-http/serializer";
import { parseRequest } from "./client/lib/bluetooth-http/parser";

const app = initApp(process.env);

async function req(request: string) {
  const parsedRequest = parseRequest(request);
  const response = await app.fetch(parsedRequest);
  return await serializeResponse(response);
}

(async () => {
  console.log(await req("GET http://bollerwagen.v3/api/greeting/Bluetooth HTTP/1.1\n\n"));
})();
