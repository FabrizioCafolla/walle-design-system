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

export function calculateReadingTime(content: string): {
  text: string;
  minutes: number;
  words: number;
} {
  const wordsPerMinute = 200;
  const imageReadingTime = 12; // secondi per immagine
  const codeReadingTime = 25; // secondi per blocco di codice

  // Rimuovi HTML/Markdown e conta le parole
  const cleanText = content
    .replace(/<[^>]*>/g, "") // Rimuovi HTML
    .replace(/```[\s\S]*?```/g, "") // Rimuovi blocchi di codice
    .replace(/`[^`]*`/g, "") // Rimuovi codice inline
    .replace(/!\[.*?\]\(.*?\)/g, "") // Rimuovi immagini markdown
    .replace(/\[.*?\]\(.*?\)/g, "$1") // Converti link in testo
    .trim();

  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;

  // Conta immagini e blocchi di codice
  const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;

  // Calcola tempo totale
  const textTime = words / wordsPerMinute;
  const imageTime = (images * imageReadingTime) / 60;
  const codeTime = (codeBlocks * codeReadingTime) / 60;

  const totalMinutes = Math.ceil(textTime + imageTime + codeTime);

  return {
    text: `${totalMinutes} minute${totalMinutes !== 1 ? "s" : ""} read`,
    minutes: totalMinutes,
    words: words,
  };
}
