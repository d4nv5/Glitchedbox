// scripts/build-zip.js
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const fg = require("fast-glob");

async function main() {
  const root = process.cwd();
  const outDir = path.join(root, "dist");
  const outFile = path.join(outDir, "deploy.zip");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(outFile)) fs.unlinkSync(outFile);

  // Incluye todo, excluye lo que no debe ir al hosting
  const files = await fg(["**/*"], {
    dot: true,              // incluye .htaccess, etc.
    onlyFiles: true,
    followSymbolicLinks: false,
    ignore: [
      ".git/**",
      "node_modules/**",
      "dist/**",
      ".vscode/**",
      ".idea/**",
      ".env",
      ".env.*",
      "**/*.sql",
      "**/*.dump",
      "**/*.gz",
      "uploads/**",
      "storage/**",
      "logs/**",
      "cache/**",
      "tmp/**",
      "sessions/**"
      // Si NO quieres subir vendor porque lo instalas en servidor, descomenta:
      // "vendor/**"
    ],
  });

  const output = fs.createWriteStream(outFile);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✅ deploy.zip creado: ${outFile}`);
    console.log(`📦 Tamaño: ${(archive.pointer() / 1024).toFixed(1)} KB`);
    console.log(`🗂 Archivos incluidos: ${files.length}`);
  });

  archive.on("warning", (err) => {
    console.warn("⚠️ Warning:", err.message);
  });

  archive.on("error", (err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });

  archive.pipe(output);

  for (const file of files) {
    archive.file(path.join(root, file), { name: file });
  }

  await archive.finalize();
}

main();
