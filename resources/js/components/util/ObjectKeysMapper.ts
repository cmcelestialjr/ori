export const ObjectMapper = (obj: object | undefined) => {
  if (!obj) return;

  return Object.keys(obj);
};
