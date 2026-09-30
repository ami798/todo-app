
import type { SVGProps } from "react";
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
type P = SVGProps<SVGSVGElement>;

export const CheckIcon = (p: P) => <svg {...base} strokeWidth={3} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
export const FlagIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...p}><path d="M5 21V4m0 0h11l-2 4 2 4H5" /></svg>
);
export const ClockIcon = (p: P) => <svg {...base} width={14} height={14} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const PencilIcon = (p: P) => <svg {...base} {...p}><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" /></svg>;
export const TrashIcon = (p: P) => <svg {...base} {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
export const PlusIcon = (p: P) => <svg {...base} width={22} height={22} {...p}><path d="M12 5v14M5 12h14" /></svg>;
export const PlayIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} {...p}><path d="M7 4.5v15l12-7.5z" /></svg>
);
export const SearchIcon = (p: P) => <svg {...base} width={18} height={18} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>;
