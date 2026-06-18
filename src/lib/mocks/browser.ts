// Browser-side MSW worker. Started from the MswProvider on the client only.

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
