// Get icon for platform
export function getPlatformIcon(platform: string): string {
  const platform_lc = platform.toLowerCase();
  if (platform_lc.includes("github")) return "fa:github";
  if (platform_lc.includes("gitlab")) return "fa:gitlab";
  if (platform_lc.includes("bitbucket")) return "fa:bitbucket";
  return "fa:code-fork";
}

export function calculateTimeAgo(dateString: string): string | null {
  if (!dateString) return null;
  const creationDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - creationDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function formatDate(dateString: string): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
