// Update release values here when an installer is ready to publish.
// Keep downloadUrl null until an official HTTPS download URL is available.
const jesseKBooksReleases = {
  macos: {
    version: null,
    supportedOs: null,
    installerFormat: null,
    fileSize: null,
    releaseDate: null,
    releaseNotes: null,
    checksum: null,
    downloadUrl: null
  },
  windows: {
    version: null,
    supportedOs: null,
    installerFormat: null,
    fileSize: null,
    releaseDate: null,
    releaseNotes: null,
    checksum: null,
    downloadUrl: null
  }
};

document.querySelectorAll("[data-release-platform]").forEach((panel) => {
  const platform = panel.dataset.releasePlatform;
  const release = jesseKBooksReleases[platform];
  if (!release) return;

  panel.querySelectorAll("[data-release-field]").forEach((field) => {
    const value = release[field.dataset.releaseField];
    field.textContent = value || "Not yet published";
  });

  const button = panel.querySelector("[data-download-button]");
  if (!button || !release.downloadUrl) return;

  const downloadLink = document.createElement("a");
  downloadLink.className = button.className;
  downloadLink.href = release.downloadUrl;
  downloadLink.textContent = `Download for ${platform === "macos" ? "Mac" : "Windows"}`;
  button.replaceWith(downloadLink);
});
