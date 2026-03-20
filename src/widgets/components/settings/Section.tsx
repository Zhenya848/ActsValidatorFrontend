import type { LucideProps } from "lucide-react";
import type { ReactNode } from "react";

interface ISectionParameters {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>,
  title: string,
  iconColor: string,
  children: ReactNode
}

export function Section({ icon: Icon, title, iconColor, children }: ISectionParameters) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}