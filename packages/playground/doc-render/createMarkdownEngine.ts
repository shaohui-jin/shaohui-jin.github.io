import MarkdownIt from "markdown-it";

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function createMarkdownEngine(): MarkdownIt {
  const engine = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  const headingOpen = engine.renderer.rules.heading_open;
  engine.renderer.rules.heading_open = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const inlineToken = tokens[idx + 1];
    const title = inlineToken?.content ?? "";
    if (title) {
      token.attrSet("id", slugify(title));
    }
    return headingOpen ? headingOpen(tokens, idx, opts, env, self) : self.renderToken(tokens, idx, opts);
  };

  return engine;
}

const markdownEngine = createMarkdownEngine();

export function renderMarkdown(source: string): string {
  return markdownEngine.render(source);
}
