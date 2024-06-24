import { initApp } from "./server/main";
import { createBluetoothServer } from "./server/lib/bluetooth/bluetooth-server";

const app = initApp(process.env);
createBluetoothServer(app.fetch);
