export type AnyArr = any[];

type MessageType = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ParamsType = {
  model: "gpt-3.5-turbo";
  messages: MessageType[];
  temperature: 0.6;
  stream: true;
};

export type ResponseType {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
}[];

interface Choice {
  delta: Delta;
  finish_reason: null | string;
  index: number;
}

interface Delta {
  content: string;
  role?: string;
}
