/* eslint-disable import-x/no-extraneous-dependencies */
import AJV, { _, KeywordCxt } from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import { writeFileSync } from "fs";
import { resolve } from "path";

import Nodes from "./src/nodes.ts";
import Page from "./src/page.ts";

const esm = true,
  source = true,
  code = { esm, source },
  coerceTypes = true,
  keyword = "dynamicDefaults",
  keywords = [
    {
      code({ data, gen, schema }: KeywordCxt) {
        if (schema.id === "uuid")
          gen.if(
            _`${data} && typeof ${data} === "object" && ${data}.id === undefined`,
            () => {
              gen.assign(_`${data}.id`, _`generateSlug()`);
            },
          );
      },
      keyword,
    },
  ],
  removeAdditional = true,
  schemas = [Nodes, Page],
  strictSchema = false,
  useDefaults = true,
  ajv = new AJV({
    code,
    coerceTypes,
    keywords,
    removeAdditional,
    schemas,
    strictSchema,
    useDefaults,
  });

writeFileSync(
  resolve("dist/index.js"),
  `import { generateSlug } from "random-word-slugs";${standaloneCode(ajv)}`,
);
