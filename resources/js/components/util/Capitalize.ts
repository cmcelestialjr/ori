export const Capitalize = (value: string | undefined) => {
  if (!value) return;

  const char = value.charAt(0).toUpperCase();

  return char.concat(value.slice(1));
};
