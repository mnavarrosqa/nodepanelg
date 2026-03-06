import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just redirect to dashboard
        navigate('/');
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-100", children: [_jsxs("div", { className: "card w-full max-w-md p-6", children: [_jsxs("div", { className: "flex flex-col items-center mb-6 text-center", children: [_jsx("div", { className: "bg-white p-3 rounded-full mb-4 shadow", children: _jsx(Cpu, { className: "text-primary", size: 40 }) }), _jsx("h1", { className: "text-2xl font-bold", children: "Sign in to NodePanelG" }), _jsx("p", { className: "text-muted text-sm mt-2", children: "Enter your credentials to access your dashboard" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-bold text-muted", children: "Email Address" }), _jsx("input", { type: "email", className: "input-field", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@example.com", required: true })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "text-sm font-bold text-muted", children: "Password" }), _jsx("input", { type: "password", className: "input-field", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true })] }), _jsx("button", { type: "submit", className: "btn-primary mt-4 py-2", children: "Sign In" })] })] }), _jsx("p", { className: "mt-6 text-muted text-sm", children: "\u00A9 2026 NodePanelG. All rights reserved." })] }));
}
//# sourceMappingURL=Login.js.map