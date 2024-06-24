import bleno from "bleno";
import { parseRequest } from "../../../common/lib/http/parser";
import { serializeResponse } from "../../../common/lib/http/serializer";
import { BLUETOOTH_CHARACTERISTIC_UUID, BLUETOOTH_SERVICE_UUID } from "../../../common/contract";

export const createBluetoothServer = (fetch: (request: Request) => Response | Promise<Response>) => {
  bleno.on("stateChange", (state) => {
    if (state === "poweredOn") bleno.startAdvertising("Bollerwagen.v3", [BLUETOOTH_SERVICE_UUID]);
    else bleno.stopAdvertising();
  });

  let lastRequest: { id: Buffer; response: Buffer } | null = null;

  const characteristic = new bleno.Characteristic({
    uuid: BLUETOOTH_CHARACTERISTIC_UUID,
    properties: ["write", "read"],
    onWriteRequest: async (data, offset, withoutResponse, callback) => {
      lastRequest = {
        id: data.subarray(0, 4),
        response: Buffer.concat([data.subarray(0, 4), await req(data.subarray(4))]),
      };
      callback(bleno.Characteristic.RESULT_SUCCESS);
    },
    onReadRequest(offset, callback) {
      callback(bleno.Characteristic.RESULT_SUCCESS, lastRequest!.response.subarray(offset));
    },
  });

  bleno.on("advertisingStart", (error) => {
    if (!error) {
      bleno.setServices([
        new bleno.PrimaryService({
          uuid: BLUETOOTH_SERVICE_UUID,
          characteristics: [characteristic],
        }),
      ]);
    }
  });

  async function req(request: Buffer) {
    const parsedRequest = parseRequest(request);
    const response = await fetch(parsedRequest);
    return Buffer.from(await serializeResponse(response));
  }
};
