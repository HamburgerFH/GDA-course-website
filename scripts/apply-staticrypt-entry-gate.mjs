import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const siteDirectory = process.argv[2] ?? "_site";
const publishedRoot = process.argv[3] ?? "/";
const bodyEnd = "</body>";
const gateMarker = "data-gda-entry-gate";

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(path);
    }
  }

  return files;
}

const gate = String.raw`<script ${gateMarker}>
(() => {
  const publishedRoot = ${JSON.stringify(publishedRoot)};
  const siteRoot = window.location.pathname.startsWith(publishedRoot)
    ? publishedRoot
    : "/";
  const isEntryPage =
    window.location.pathname === siteRoot ||
    window.location.pathname === siteRoot + "index.html";
  const rememberCheckbox = document.getElementById("staticrypt-remember");

  if (rememberCheckbox) {
    rememberCheckbox.checked = true;
  }

  window.onload = async () => {
    const { isSuccessful } = await staticrypt.handleDecryptOnLoad();

    if (isSuccessful) {
      return;
    }

    if (!isEntryPage) {
      window.location.replace(new URL(siteRoot, window.location.origin));
      return;
    }

    document.getElementById("staticrypt_loading").classList.add("hidden");
    document.getElementById("staticrypt_content").classList.remove("hidden");
    document.getElementById("staticrypt-password").focus();
  };
})();
</script>`;

const htmlFiles = await findHtmlFiles(siteDirectory);

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");

  if (html.includes(gateMarker)) {
    throw new Error(`Entry gate already exists in ${file}`);
  }

  if (!html.includes(bodyEnd)) {
    throw new Error(`Missing closing body tag in ${file}`);
  }

  await writeFile(file, html.replace(bodyEnd, `${gate}\n${bodyEnd}`));
}

console.log(`Applied the single-entry gate to ${htmlFiles.length} HTML files`);
