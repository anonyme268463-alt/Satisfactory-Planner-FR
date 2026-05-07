const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/Satisfactory-Planner-FR' : '';

/**
 * Prepends the correct basePath to asset URLs based on the environment.
 * @param path The relative path to the asset (should start with a slash).
 * @returns The full path with the appropriate prefix.
 */
export function getAssetPath(path: string): string {
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // In production (GitHub Pages), we need to prefix with the repository name.
  // In development, the basePath is empty.
  return `${basePath}${normalizedPath}`;
}
