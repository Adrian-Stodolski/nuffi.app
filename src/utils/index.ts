import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to human readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Debounce function to limit the rate of function calls
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Validate if a string is a valid path
 */
export function isValidPath(path: string): boolean {
  // Basic path validation - can be enhanced based on OS
  return path.length > 0 && !path.includes("..") && path.trim() === path;
}

/**
 * Extract file extension from path
 */
export function getFileExtension(path: string): string {
  const lastDot = path.lastIndexOf(".");
  return lastDot > 0 ? path.substring(lastDot + 1).toLowerCase() : "";
}

/**
 * Get project type from file extensions and structure
 */
export function detectProjectType(files: string[]): string {
  const extensions = files.map(getFileExtension);
  const hasPackageJson = files.some(f => f.endsWith("package.json"));
  const hasCargoToml = files.some(f => f.endsWith("Cargo.toml"));
  const hasRequirementsTxt = files.some(f => f.endsWith("requirements.txt"));
  const hasPyprojectToml = files.some(f => f.endsWith("pyproject.toml"));

  if (hasPackageJson) return "nodejs";
  if (hasCargoToml) return "rust";
  if (hasRequirementsTxt || hasPyprojectToml) return "python";
  
  // Fallback to most common extension
  const extCounts = extensions.reduce((acc, ext) => {
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommon = Object.entries(extCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  switch (mostCommon) {
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      return "nodejs";
    case "rs":
      return "rust";
    case "py":
      return "python";
    default:
      return "mixed";
  }
}