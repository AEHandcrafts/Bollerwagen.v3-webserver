import { App } from "vue";
import HttpRequestMock from "http-request-mock";
import { RequestInfo } from "http-request-mock/src/types";
import FetchInterceptor from "http-request-mock/src/interceptor/fetch";
import { serializeRequest } from "../../common/lib/http/serializer";
import { parseResponse } from "../../common/lib/http/parser";

import { Buffer } from "buffer";
import { useBluetoothServer } from "../composables/bluetooth-server";

globalThis.Buffer = Buffer;

export const BluetoothHttpInterceptor = {
  install: async (app: App, options: { url: string; enableLog?: boolean }) => {
    const mocker = HttpRequestMock.setup();
    new FetchInterceptor(mocker).getFetchResponse = (responseBody: Response) => responseBody;

    if (!options.enableLog) mocker.disableLog();

    mocker.mock({
      url: `//${options.url}/`,
      async response(requestInfo: RequestInfo) {
        const httpReq = serializeRequest(requestInfo);
        const response = await useBluetoothServer().fetch(Buffer.from(httpReq));
        return parseResponse(response);
      },
    });
  },
};
