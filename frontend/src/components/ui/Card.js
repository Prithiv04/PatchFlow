import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export default function Card({ className, children, ...props }) {
    return (_jsx("div", { className: cn('glass rounded-xl shadow-lg border border-border bg-card', className), ...props, children: children }));
}
