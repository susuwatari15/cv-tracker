interface FormSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  icon,
  children,
}: FormSectionProps) {
  return (
    <div className="bg-surface border border-border-default rounded-[14px] p-6 mb-4 shadow-sm">
      <h3 className=" text-[15px] font-semibold mb-4 text-ink flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
}
