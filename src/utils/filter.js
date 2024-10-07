function filterImages(images = []) {
  const allowed = [
    ".jpg",
    ".png",
    ".webp",
    ".jpeg",
    ".svg",
    ".ico",
    ".jfif",
    ".avif",
    ".gif",
    ".tiff"
  ];

  return images.filter((image) => {
    return allowed.some((ext) => {
      if (image.endsWith(ext)) {
        return true;
      }
      return false;
    });
  });
}

export default filterImages;

