import { UPLOADS_URL } from "./API";

function srcBuilder(filename = "", ...rest) {
  const additional = rest.join("/");
  if (!filename) throw new Error("src is not defined");
  return `${UPLOADS_URL}${additional}/${filename}`;
}

export { srcBuilder };
