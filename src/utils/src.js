import { UPLOADS_URL } from "./API";

function srcBuilder(src = "") {
  if (!src) throw new Error("src is not defined");
  const path = UPLOADS_URL + src;
  return path;
}

export { srcBuilder };
