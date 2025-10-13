import { Schema } from "mongoose";

function formatDates(obj: any) {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      formatDates(obj[i]);
    }
    return;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (value instanceof Date) {
      obj[key] = value.toISOString();
    } else if (value && typeof value === "object") {
      formatDates(value); // recurse into nested objects
    }
  }
}

export function toJSONPlugin(schema: Schema) {
  function merge(type: "toJSON" | "toObject", formatter: (ret: any) => void) {
    const existing = (schema.get(type) || {}) as any;
    const oldTransform = existing.transform;

    // set merged options but preserve other existing options (like virtuals)
    schema.set(type, {
      ...existing,
      // keep existing options; we intentionally do NOT override 'virtuals' here
      transform(doc: any, ret: any, options: any) {
        // allow previous transform to run first
        if (typeof oldTransform === "function") {
          // oldTransform might return a new object; respect that
          const maybe = oldTransform.call(this, doc, ret, options);
          if (maybe && typeof maybe === "object") {
            ret = maybe;
          }
        }

        try {
          if (ret && ret._id) {
            // convert ObjectId -> string id
            // guard in case _id is already a string
            try {
              ret.id = ret._id.toString();
            } catch {
              ret.id = ret._id;
            }
            delete ret._id;
          }

          delete ret.__v;

          formatter(ret);
        } catch (err) {
          // Keep transform resilient — do not throw
          // optionally log in dev
        }

        // some transforms expect a returned object
        return ret;
      },
    });
  }

  merge("toJSON", (obj) => formatDates(obj));
  merge("toObject", (obj) => formatDates(obj));
}
