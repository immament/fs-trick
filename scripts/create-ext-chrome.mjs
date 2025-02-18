import fs from "fs";
import { zipDirectory } from "./zipDirectory.mjs";

const outDir = "./out";
const extDir = "./src";

const extVersion = getExtVersion();

zipDirectory(extDir, `${outDir}/chrome-fstrick-v${extVersion}.zip`)
  .catch((err) => {
    console.error("Exception during zip creation:", err);
    process.exit(1);
  })
  .then((msg) => {
    console.log("done:", msg);
  });

function getExtVersion() {
  const manifest = JSON.parse(fs.readFileSync(extDir + "/manifest.json"));
  return manifest.version;
}
