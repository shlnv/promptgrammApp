export const trimCode = (code: string | null) => {
  if (code === null) throw new Error("Code is null");
  code = code.trim();
  if (code.startsWith("```html")) {
    return code.substring(7, code.length - 3).trim();
  } else if (code.startsWith("```")) {
    return code.substring(3, code.length - 3).trim();
  }
  return code.trim();
};
