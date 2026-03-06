import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Server, Users, Settings, LogOut, Cpu } from 'lucide-react';
import './Sidebar.css';
export function Sidebar() {
    const location = useLocation();
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Server, label: 'Applications', path: '/apps' },
        { icon: Users, label: 'Users', path: '/users' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];
    return (_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-header", children: [_jsx(Cpu, { size: 28, className: "text-primary" }), _jsx("span", { className: "sidebar-title", children: "NodePanelG" })] }), _jsx("nav", { className: "sidebar-nav", children: menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (_jsxs(Link, { to: item.path, className: `sidebar-link ${isActive ? 'active' : ''}`, children: [_jsx(Icon, { size: 20 }), _jsx("span", { children: item.label })] }, item.path));
                }) }), _jsx("div", { className: "sidebar-footer", children: _jsxs("button", { className: "sidebar-link logout-btn", children: [_jsx(LogOut, { size: 20 }), _jsx("span", { children: "Logout" })] }) })] }));
}
//# sourceMappingURL=Sidebar.js.map