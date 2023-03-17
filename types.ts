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

export type ResponseType = {
  data:
    | {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: {
          delta: {
            content: string;
          };
          index: number;
          finish_reason: string | null;
        };
      }
    | AnyArr;
};
