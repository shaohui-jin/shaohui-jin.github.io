/**
 * 仓库 README 拉取与相对路径改写。
 *
 * 作品页右侧直接展示 GitHub 仓库根目录的 README。运行时不经过构建，
 * 所以内容从 raw / jsDelivr 取，并做两件事：
 *   1. 相对图片和相对链接改写到该仓库的 GitHub 地址，否则点开是 404；
 *   2. 结果按仓库缓存，来回切换不重复请求。
 */

const RAW_BASE = "https://raw.githubusercontent.com";
const CDN_BASE = "https://cdn.jsdelivr.net/gh";

/** 用 HEAD 指向默认分支，避免写死 main / master */
const REF = "HEAD";

const cache = new Map<string, string | null>();

export interface ReadmeResult {
  /** 改写后的 markdown；仓库没有 README 时为 null */
  source: string | null;
  /** 仓库根地址，用于「在 GitHub 打开」 */
  repoUrl: string;
}

/** 把 README 里的相对路径改成绝对地址 */
export function resolveRelativePaths(markdown: string, repo: string): string {
  const rawBase = `${RAW_BASE}/${repo}/${REF}/`;
  const gitHubBase = `https://github.com/${repo}/blob/${REF}/`;

  const isAbsolute = (value: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value.trim());

  /** 图片走 raw，源码 / 目录走 GitHub 页面 */
  const rewrite = (url: string, base: string) => {
    const trimmed = url.trim();
    if (!trimmed || isAbsolute(trimmed)) return url;
    return base + trimmed.replace(/^\.\//, "");
  };

  return markdown
    .replace(
      /(!\[[^\]]*\]\()([^)\s]+)([^)]*\))/g,
      (_all, head: string, url: string, tail: string) => {
        return `${head}${rewrite(url, rawBase)}${tail}`;
      },
    )
    .replace(
      /(<img\b[^>]*?\bsrc=")([^"]+)(")/gi,
      (_all, head: string, url: string, tail: string) => {
        return `${head}${rewrite(url, rawBase)}${tail}`;
      },
    )
    .replace(/(\]\()([^)\s]+)([^)]*\))/g, (_all, head: string, url: string, tail: string) => {
      return `${head}${rewrite(url, gitHubBase)}${tail}`;
    })
    .replace(
      /(<a\b[^>]*?\bhref=")([^"]+)(")/gi,
      (_all, head: string, url: string, tail: string) => {
        return `${head}${rewrite(url, gitHubBase)}${tail}`;
      },
    );
}

/** 依次尝试 raw 与 jsDelivr；都拿不到返回 null */
async function fetchReadme(repo: string): Promise<string | null> {
  const candidates = [
    `${RAW_BASE}/${repo}/${REF}/README.md`,
    `${CDN_BASE}/${repo}@${REF}/README.md`,
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.text();
    } catch {
      /* 网络异常时换下一个源 */
    }
  }
  return null;
}

/** 取某个仓库的 README（带缓存）；repo 形如 `shaohui-jin/tool-box` */
export async function loadRepoReadme(repo: string): Promise<ReadmeResult> {
  const repoUrl = `https://github.com/${repo}`;
  if (cache.has(repo)) {
    return { source: cache.get(repo) ?? null, repoUrl };
  }

  const raw = await fetchReadme(repo);
  const source = raw ? resolveRelativePaths(raw, repo) : null;
  cache.set(repo, source);
  return { source, repoUrl };
}
