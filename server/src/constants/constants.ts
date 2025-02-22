export const responseFormat = {
  type: "json_schema",
  json_schema: {
    name: "segments_schema",
    strict: true,
    schema: {
      type: "object",
      properties: {
        segments: {
          type: "array",
          description:
            "A list of segments containing rank, start, end, and reason.",
          items: {
            type: "object",
            properties: {
              rank: {
                type: "number",
                description: "The rank of the segment.",
              },
              start: {
                type: "number",
                description: "The start position of the segment.",
              },
              end: {
                type: "number",
                description: "The end position of the segment.",
              },
              reason: {
                type: "string",
                description: "The reason for defining this segment.",
              },
            },
            required: ["rank", "start", "end", "reason"],
            additionalProperties: false,
          },
        },
      },
      required: ["segments"],
      additionalProperties: false,
    },
  },
};
