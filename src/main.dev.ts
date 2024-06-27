import { initApp } from "./server/main";
import { serve } from "@hono/node-server";
import { name, version } from "../package.json";
import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "./common/contract";
import { swaggerUI } from "@hono/swagger-ui";
import { SerialPort } from "serialport";
import { UartLedController } from "./server/uart-led-controller";

const app = initApp(process.env);
app.get("/api-spec", (c) =>
  c.json(generateOpenApi(contract, { info: { title: name, version } }, { setOperationId: true })),
);
app.get("/api", swaggerUI({ url: "/api-spec" }));

serve({ fetch: app.fetch, port: 5174 });

const baud = 960000;

new SerialPort({ path: "COM2001", baudRate: baud }).on("data", (data) => console.log(data));

const ledController = new UartLedController("COM2000", baud, 2293, "GRB");
(async () => {
  await ledController.open();
  ledController.setRGB(3, 1, 2, 3);
  await ledController.write();
})();
