import archiver from "archiver";
import fs from "fs";

const outputDir = "./out";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

zipDirectory("src", outputDir + "/fstrick.zip")
  .catch((err) => {
    console.error("Exception during zip creation:", err);
    process.exit(1);
  })
  .then((msg) => {
    console.log("done:", msg);
  });

/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve("zip created:" + outPath));
    archive.finalize();
  });
}
