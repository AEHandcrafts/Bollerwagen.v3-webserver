import { App } from "vue";
import HttpRequestMock from "http-request-mock";
import { RequestInfo } from "http-request-mock/src/types";
import FetchInterceptor from "http-request-mock/src/interceptor/fetch";
import { serializeRequest } from "../lib/bluetooth-http/serializer";
import { parseResponse } from "../lib/bluetooth-http/parser";

import { Buffer } from "buffer";

globalThis.Buffer = Buffer;

export const BluetoothHttpInterceptor = {
  install: (app: App, options: { url: string; enableLog?: boolean }) => {
    const mocker = HttpRequestMock.setup();
    new FetchInterceptor(mocker).getFetchResponse = (responseBody: Response) => responseBody;

    if (!options.enableLog) mocker.disableLog();

    mocker.mock({
      url: `//${options.url}/`,
      response(requestInfo: RequestInfo) {
        const httpReq = serializeRequest(requestInfo);
        console.log(httpReq);
        // TODO: send over bluetooth to server

        const response = "HTTP/1.1 200 \ncontent-type: application/json; charset=UTF-8\n\nHello Bluetooth\n\n";
        return parseResponse(response);
      },
    });
  },
};
