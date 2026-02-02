export interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  return (
    <article
      className={`prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-deep-brown prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-charcoal/80 prose-a:text-burnt-sienna prose-a:no-underline hover:prose-a:text-deep-brown prose-strong:text-deep-brown prose-blockquote:border-l-burnt-sienna prose-blockquote:text-charcoal/70 prose-code:text-burnt-sienna prose-pre:bg-charcoal prose-pre:text-cream prose-li:text-charcoal/80 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
