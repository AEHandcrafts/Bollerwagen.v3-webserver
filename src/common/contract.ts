import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const BLUETOOTH_SERVICE_UUID = "000f6564-b7f0-45fc-aa44-3f9f9f29ebe6";
export const BLUETOOTH_CHARACTERISTIC_UUID = "ccc743b4-d35e-47f9-8fb9-09eb69d70b08";

export const contract = initContract().router(
  {
    greet: {
      method: "GET",
      path: "/greeting/:name",
      pathParams: z.object({
        name: z.string(),
      }),
      responses: {
        200: z.string(),
      },
    },
  },
  { pathPrefix: "/api", strictStatusCodes: true },
);
