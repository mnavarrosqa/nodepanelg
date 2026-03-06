import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, Server, Users, DollarSign } from 'lucide-react';
import { Layout } from '../components/Layout';
export function Dashboard() {
    const stats = [
        { label: 'Total Apps', value: '12', icon: Server, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Active Users', value: '450', icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
        { label: 'System Load', value: '24%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
        { label: 'Revenue', value: '$12,450', icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    ];
    return (_jsxs(Layout, { children: [_jsxs("header", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Dashboard" }), _jsx("p", { className: "text-muted", children: "Welcome back, Administrator" })] }), _jsx("button", { className: "btn-primary", children: "New Application" })] }), _jsx("div", { className: "stats-grid", children: stats.map((stat) => {
                    const Icon = stat.icon;
                    return (_jsxs("div", { className: "card flex items-center gap-4", children: [_jsx("div", { className: `p-4 rounded-full ${stat.bg}`, children: _jsx(Icon, { className: stat.color, size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-muted text-sm", children: stat.label }), _jsx("p", { className: "font-bold text-xl", children: stat.value })] })] }, stat.label));
                }) }), _jsxs("div", { className: "card mt-6", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Recent Activity" }), _jsx("div", { className: "text-muted", children: "No recent activity found." })] })] }));
}
//# sourceMappingURL=Dashboard.js.map