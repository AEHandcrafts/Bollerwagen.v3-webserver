import { SerialPort } from "serialport";

export type ColorOrder = "RGB" | "RBG" | "GRB" | "GBR" | "BRG" | "BGR";

export class UartLedController {
  private buffer;
  private port;

  private rI;
  private gI;
  private bI;

  private static readonly COLOR_ORDER_TABLE = {
    RGB: [0, 1, 2],
    RBG: [0, 2, 1],
    GRB: [1, 0, 2],
    GBR: [2, 0, 1],
    BRG: [1, 2, 0],
    BGR: [2, 1, 0],
  };

  constructor(serialPort: string, baudRate: number, ledBytes: number, colorOrder: ColorOrder) {
    this.port = new SerialPort({
      path: serialPort,
      baudRate: baudRate,
      autoOpen: false,
    });

    this.buffer = Buffer.alloc(ledBytes);

    const order = UartLedController.COLOR_ORDER_TABLE[colorOrder];
    this.rI = order[0];
    this.gI = order[1];
    this.bI = order[2];
  }

  get(index: number) {
    return this.buffer[index];
  }

  set(index: number, data: number) {
    this.buffer[index] = data;
  }

  setRGB(index: number, r: number, g: number, b: number) {
    this.buffer[index + this.rI] = r;
    this.buffer[index + this.gI] = g;
    this.buffer[index + this.bI] = b;
  }

  open() {
    return new Promise((resolve) => this.port.open(resolve));
  }

  write() {
    return new Promise((resolve) => this.port.write(this.buffer, resolve));
  }

  close() {
    return new Promise((resolve) => this.port.close(resolve));
  }
}
