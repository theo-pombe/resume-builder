import { Schema } from "mongoose";

function formatDates(obj: any) {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (value instanceof Date) {
      obj[key] = value.toISOString();
    } else if (typeof value === "object") {
      formatDates(value); // recurse into nested objects
    }
  }
}

export function toJSONPlugin(schema: Schema) {
  schema.set("toJSON", {
    transform: (_doc, ret) => {
      const obj = ret as any;
      obj.id = obj._id.toString();
      delete obj._id;
      delete obj.__v;

      formatDates(obj);
    },
  });

  schema.set("toObject", {
    transform: (_doc, ret) => {
      const obj = ret as any;
      obj.id = obj._id.toString();
      delete obj._id;
      delete obj.__v;

      formatDates(obj);
    },
  });
}
