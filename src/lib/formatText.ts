/**
 * Minimal markdown → HTML for AI output.
 *
 * Output is injected with dangerouslySetInnerHTML, and the text it renders
 * comes back from a model that was fed untrusted input (CV files, pasted
 * JDs). So the source is HTML-escaped first and only our own tags are
 * reintroduced — otherwise a CV containing markup could inject it into the
 * page. Presentation lives in the `.prose-ai` styles, not in inline
 * attributes.
 */
export function formatText(text: string): string {
	const escaped = text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

	return escaped
		.replace(/`([^`]+?)`/g, "<code>$1</code>")
		.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*([^*]+?)\*/g, "<em>$1</em>")
		.replace(/^#{3}\s+(.*)$/gm, "<h4>$1</h4>")
		.replace(/^#{2}\s+(.*)$/gm, "<h3>$1</h3>")
		.replace(/^\s*[-*]\s+(.*)$/gm, "<li>$1</li>")
		.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>")
		.split(/\n{2,}/)
		.map((block) => {
			const trimmed = block.trim();
			if (!trimmed) return "";
			// Block-level markup is already wrapped; don't nest it in a <p>.
			if (/^<(ul|h3|h4)/.test(trimmed)) return trimmed;
			return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
		})
		.join("");
}
