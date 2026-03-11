interface OutputBoxProps {
  show: boolean;
  html: string;
  actions: React.ReactNode;
}

export default function OutputBox({ show, html, actions }: OutputBoxProps) {
  if (!show) return null;

  return (
    <div className="animate-fade-up bg-canvas-2 border border-border-default rounded-[14px] p-5 mt-4 text-[13.5px] leading-[1.7] text-ink">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="flex gap-2 mt-3 pt-3 border-t border-border-default">
        {actions}
      </div>
    </div>
  );
}
