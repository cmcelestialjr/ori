export const imageMimeType = (path: string) => {
  const mimeTypeRegex = /\.(jpg|jpeg|png)(\?.*)?$/i;

  return mimeTypeRegex.test(path);
};
