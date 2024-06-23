import { initClient } from "@ts-rest/core";
import { contract } from "../../common/contract";

const server = initClient(contract, {
  baseUrl: "http://bollerwagen.v3",
  baseHeaders: {},
  throwOnUnknownStatus: true,
  jsonQuery: true,
  validateResponse: true,
});
export const useBluetoothServer = () => server;
