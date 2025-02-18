import fs from "fs";
import { zipDirectory } from "./zipDirectory.mjs";

const outDir = "./out";
const outExtDir = outDir + "/ext";

copyExtensionContent();

const extVersion = replaceManifest();
zipDirectory(outExtDir, `${outDir}/firefox-fstrick-v${extVersion}.zip`)
  .catch((err) => {
    console.error("Exception during zip creation:", err);
    process.exit(1);
  })
  .then((msg) => {
    console.log("done:", msg);
  });

// done

function copyExtensionContent() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  if (fs.existsSync(outExtDir)) {
    fs.rmSync(outExtDir, { recursive: true });
  }
  fs.cpSync("./src", outExtDir, { recursive: true });
}

function replaceManifest() {
  const manifest = JSON.parse(fs.readFileSync(outExtDir + "/manifest.json"));
  console.log("version:", manifest.version);
  manifest.background.scripts = [manifest.background.service_worker];
  delete manifest.background.service_worker;
  fs.writeFileSync(outExtDir + "/manifest.json", JSON.stringify(manifest));
  return manifest.version;
}
