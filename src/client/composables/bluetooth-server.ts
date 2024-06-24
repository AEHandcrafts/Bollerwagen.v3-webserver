import { initClient } from "@ts-rest/core";
import { BLUETOOTH_CHARACTERISTIC_UUID, BLUETOOTH_SERVICE_UUID, contract } from "../../common/contract";

class BluetoothServer {
  req = initClient(contract, {
    baseUrl: "http://bollerwagen.v3",
    baseHeaders: {},
    throwOnUnknownStatus: true,
    jsonQuery: true,
    validateResponse: true,
  });

  private requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  async connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [BLUETOOTH_SERVICE_UUID] }],
      });
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService(BLUETOOTH_SERVICE_UUID);
      this.characteristic = await service.getCharacteristic(BLUETOOTH_CHARACTERISTIC_UUID);
      console.log("Connected to Bluetooth device");
    } catch (error) {
      console.error("Error connecting to Bluetooth device:", error);
    }
  }

  private getNextRequestId() {
    this.requestId += 93937;
    return Buffer.from([
      (this.requestId >> 24) & 255,
      (this.requestId >> 16) & 255,
      (this.requestId >> 8) & 255,
      (this.requestId >> 0) & 255,
    ]);
  }

  async fetch(data: Buffer) {
    const reqId = this.getNextRequestId();
    await this.characteristic!.writeValueWithResponse(Buffer.concat([reqId, data]));
    const response = await this.characteristic!.readValue();
    return Buffer.from(response.buffer).subarray(4);
  }
}

const server = new BluetoothServer();
export const useBluetoothServer = () => server;
