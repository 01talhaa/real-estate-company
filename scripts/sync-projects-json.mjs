import fs from "fs/promises"
import path from "path"
import vm from "vm"
import { createRequire } from "module"
import ts from "typescript"

const root = process.cwd()
const sourcePath = path.join(root, "data", "real-estate-projects.ts")
const outputPath = path.join(root, "data", "projects.json")

const source = await fs.readFile(sourcePath, "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText

const sandbox = {
  exports: {},
  module: { exports: {} },
  require: createRequire(import.meta.url),
  console,
  process,
  Buffer,
}
vm.createContext(sandbox)
vm.runInContext(compiled, sandbox)

const exported = sandbox.module.exports.realEstateProjects ?? sandbox.exports.realEstateProjects
if (!exported) {
  throw new Error("realEstateProjects export not found in data/real-estate-projects.ts")
}

await fs.writeFile(outputPath, JSON.stringify(Object.values(exported), null, 2), "utf8")
console.log(`Wrote ${outputPath}`)
