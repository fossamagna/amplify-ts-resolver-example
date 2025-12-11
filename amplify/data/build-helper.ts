import esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs/promises";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export async function build(key: string) {
  const outdir = path.join(
    __dirname,
    "..",
    "..",
    "build",
    "data",
    path.dirname(key)
  );

  const outfile = `${path.basename(key, path.extname(key))}.js`;

  const result = await esbuild.build({
    bundle: true,
    write: false,
    outfile: path.join(outdir, outfile),
    entryPoints: [path.join(__dirname, key)],
    format: "esm",
    platform: "node",
    target: "esnext",
    sourcemap: "inline",
    sourcesContent: false,
    tsconfigRaw: await fs.readFile(
      path.join(__dirname, "resolvers", "tsconfig.json"),
      "utf-8"
    ),
    external: ["@aws-appsync/utils"],
  });
  if (result.errors.length) {
    throw new Error("Could not build" + key + ": " + result.errors.join("\n"));
  }
  await fs.mkdir(path.dirname(result.outputFiles[0].path), { recursive: true });
  await fs.writeFile(result.outputFiles[0].path, result.outputFiles[0].text);
  return result.outputFiles[0].path;
}
