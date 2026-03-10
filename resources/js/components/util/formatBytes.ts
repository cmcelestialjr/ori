export default function formatBytes(
  bytes: number,
  precision: number = 2,
): string {
  const units: string[] = ["B", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 B";

  const pow = Math.floor(Math.log(bytes) / Math.log(1024));
  const index = Math.min(pow, units.length - 1);

  const size = bytes / Math.pow(1024, index);
  return size.toFixed(precision) + " " + units[index];
}
