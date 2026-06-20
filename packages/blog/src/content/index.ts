import homeMarkdown from "./home.md?raw";
import migrationRoadmapMarkdown from "./migration-roadmap.md?raw";

export interface BlogDocConfig {
  key: string;
  label: string;
  groupKey: "overview" | "migration";
  tag: string;
  order: number;
  fileName: string;
  source: string;
}

export const blogDocConfigs: BlogDocConfig[] = [
  {
    key: "blog-home",
    label: "博客模块说明",
    groupKey: "overview",
    tag: "Markdown",
    order: 10,
    fileName: "home.md",
    source: homeMarkdown,
  },
  {
    key: "blog-migration-roadmap",
    label: "博客迁移路线",
    groupKey: "migration",
    tag: "Roadmap",
    order: 20,
    fileName: "migration-roadmap.md",
    source: migrationRoadmapMarkdown,
  },
];
