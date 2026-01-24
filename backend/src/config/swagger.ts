import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const specPath = path.join(process.cwd(), "docs", "openapi.yaml");
const fileContents = fs.readFileSync(specPath, "utf8");
const swaggerSpec = yaml.load(fileContents) as Record<string, unknown>;

export { swaggerSpec };
