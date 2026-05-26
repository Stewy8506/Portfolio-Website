export type Project = {
  id?: string;
  title: string;
  description?: string;
  overview?: string;
  problem?: string;
  category?: string;
  date?: string;
  tech?: string[];
  image?: string;
  images?: string[];
  hasLiveDemo?: boolean;
  liveDemoUrl?: string;
  link?: string;
  sourceCodeUrl?: string;
  isCurrentlyWorkingOn?: boolean;
};

export const PROJECT_CATEGORIES = [
  "Mobile App",
  "Embedded Systems",
  "AI Product",
  "Website",
] as const;

export const SKILL_CATEGORIES = [
  "Web Dev",
  "App Dev",
  "Backend",
  "Cloud/DevOps",
  "AI/ML",
  "Embedded Systems",
  "IoT",
] as const;

export const DEFAULT_PROJECT_CATEGORY = PROJECT_CATEGORIES[0];
export const DEFAULT_SKILL_CATEGORY = SKILL_CATEGORIES[0];

export function normalizeProjectCategory(category?: string) {
  return PROJECT_CATEGORIES.find((option) => option === category) || DEFAULT_PROJECT_CATEGORY;
}

export function normalizeSkillCategory(category?: string) {
  return SKILL_CATEGORIES.find((option) => option === category) || DEFAULT_SKILL_CATEGORY;
}

export function isWebsiteProject(project: Pick<Project, "category">) {
  const category = project.category?.toLowerCase() || "";
  return category.includes("web") || category.includes("website");
}

export function getProjectLiveUrl(project: Project) {
  if (!isWebsiteProject(project) || project.hasLiveDemo === false) return "";
  return project.liveDemoUrl || project.link || "";
}
