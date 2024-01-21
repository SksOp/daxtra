import OpenAI from "openai";

import { ThreadMessage as ServerThreadMessageType } from "openai/resources/beta/threads/index.mjs";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
});

export interface ThreadMessage extends ServerThreadMessageType {}
