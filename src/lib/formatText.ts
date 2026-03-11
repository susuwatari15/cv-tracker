export function formatText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(
      /^### (.*)/gm,
      '<h4 style="font-family:var(--font-montserrat),sans-serif;font-size:14px;margin:12px 0 6px;color:#c4673a">$1</h4>'
    )
    .replace(
      /^## (.*)/gm,
      '<h3 style="font-family:var(--font-montserrat),sans-serif;font-size:15px;margin:14px 0 8px">$1</h3>'
    )
    .replace(/^- (.*)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, (m) => `<ul>${m}</ul>`)
    .split("\n\n")
    .map((p) => (p.trim() ? `<p>${p.replace(/\n/g, "<br>")}</p>` : ""))
    .join("");
}
