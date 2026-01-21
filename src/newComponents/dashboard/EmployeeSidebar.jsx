import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLock } from "react-icons/fi";

function EmployeeSidebar() {
    const location = useLocation();
    const [roles, setRoles] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

    useEffect(() => {
        const fetchEmployee = async () => {
            const storedEmployee = localStorage.getItem("selectedEmployee");
            if (!storedEmployee) return;

            const { id } = JSON.parse(storedEmployee);
            if (!id) return;

            try {
                const res = await fetch(`http://localhost:4000/employee/${id}`);
                const data = await res.json();
                if (data.success && data.employee) {
                    setSelectedEmployee(data.employee);
                } else {
                    setSelectedEmployee({ id });
                }
            } catch (err) {
                console.error(err);
                setSelectedEmployee({ id });
            }
        };

        fetchEmployee();
    }, []);

    const fetchSubRoleName = async (subRoleId) => {
        try {
            const res = await fetch(`http://localhost:4000/employee/getSubRoleName/${subRoleId}`);
            const data = await res.json();
            return data.success ? data.subRoleName : subRoleId;
        } catch (err) {
            console.error(err);
            return subRoleId;
        }
    };

    useEffect(() => {
        if (!userId) return;

        const fetchRoles = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:4000/employee/getAssignedRoles/${userId}`);
                const data = await res.json();
                if (data.success && Array.isArray(data.assignedRoles)) {
                    const allSubRoles = [];

                    for (const roleItem of data.assignedRoles) {
                        if (roleItem.subRoles && roleItem.subRoles.length > 0) {
                            for (const sub of roleItem.subRoles) {
                                // `sub` may be a string id or an object { _id, name | subRoleName }
                                if (!sub) continue;
                                if (typeof sub === "string") {
                                    const name = await fetchSubRoleName(sub);
                                    allSubRoles.push({ _id: sub, subRoleName: name });
                                } else if (typeof sub === "object") {
                                    const id = sub._id || sub.id || sub.subRoleId || "";
                                    const name = sub.name || sub.subRoleName || (id ? await fetchSubRoleName(id) : id);
                                    allSubRoles.push({ _id: id, subRoleName: name });
                                } else {
                                    const sid = String(sub);
                                    const name = await fetchSubRoleName(sid);
                                    allSubRoles.push({ _id: sid, subRoleName: name });
                                }
                            }
                        }
                    }

                    // Ensure any items still missing a readable name are resolved
                    const resolved = await Promise.all(
                        allSubRoles.map(async (item) => {
                            if (!item.subRoleName || item.subRoleName === item._id) {
                                try {
                                    const name = await fetchSubRoleName(item._id);
                                    return { ...item, subRoleName: name };
                                } catch (e) {
                                    return item;
                                }
                            }
                            return item;
                        }),
                    );

                    setRoles(resolved);
                } else {
                    setRoles([]);
                }
            } catch (err) {
                console.error(err);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [userId]);

    useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

    const getSubRoleRoute = (name) => {
        if (!name) return "/";

        // Accept either a string or an object (e.g. { subRoleName, name })
        const text = typeof name === "string" ? name : name?.subRoleName || name?.name || String(name);
        const normalized = String(text).toLowerCase();

        // B2B routes
        if (normalized === "create destination") return "/b2b-destination";
        if (normalized === "add company" || normalized === "b2b add company") return "/b2b-addcompany";

        // New fixed routes
        if (normalized === "add state") return "/createstate";
        if (normalized === "add destination") return "/createdestination";
        if (normalized === "add hotel") return "/createhotel";
        if (normalized === "add transport") return "/createtransport";

        // Invoice routes
        if (normalized === "invoice-creation" || normalized === "invoice creation") return "/createinvoice";
        if (normalized === "invoice-list" || normalized === "invoice list" || normalized === "invoicelist") return "/invoicelist";

        // Lead routes
        if (normalized === "my lead" || normalized === "mylead") return "/addmylead";
        if (normalized.includes("lead")) return "/lead-management";

        // Fallback: generate slug from name
        return `/${normalized.replace(/\s+/g, "-")}`;
    };

    if (userRole !== "employee") return null;

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed left-4 top-4 z-50 rounded-lg p-2 text-white lg:hidden"
            >
                {isMobileMenuOpen ? (
                    <div className="ml-48 mt-4">X</div>
                ) : (
                    <div>
                        <div
                            className="flex flex-col justify-center gap-1.5 p-2"
                            aria-label="Open menu"
                        >
                            <span className="block h-1 w-7 bg-gray-800"></span>
                            <span className="block h-1 w-7 bg-gray-800"></span>
                            <span className="block h-1 w-7 bg-gray-800"></span>
                        </div>
                    </div>
                )}
            </button>

            {/* Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-40 h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform lg:relative ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-gray-200 bg-black p-6 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-bold text-black">
                        {selectedEmployee?.name?.[0]?.toUpperCase() || selectedEmployee?.id?.[0] || "E"}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{selectedEmployee?.name || "Employee Dashboard"}</h2>
                        <p className="mt-1 text-xs text-gray-300">Employee Panel</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="space-y-2">
                        <Link
                            to="/dashboard"
                            className={`block rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/dashboard" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            Dashboard
                        </Link>

                        {loading ? (
                            <p className="mt-4 text-center text-sm text-gray-400">Loading...</p>
                        ) : roles.length > 0 ? (
                            roles.map((sub) => {
                                const route = getSubRoleRoute(sub.subRoleName);
                                const active = location.pathname === route;
                                const label = sub?.subRoleName || sub?.name || sub?.roleName || sub?._id || String(sub);
                                const key = sub?._id || label;
                                return (
                                    <Link
                                        key={key}
                                        to={getSubRoleRoute(label)}
                                        className={`block rounded-lg px-4 py-2 font-medium ${
                                            active ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                );
                            })
                        ) : (
                            <p className="mt-4 text-center text-gray-400">No roles assigned yet.</p>
                        )}
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-4">
                        <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Account</p>
                        <Link
                            to="/change-password"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${
                                location.pathname === "/change-password" ? "bg-black text-white" : "text-gray-800 hover:bg-gray-100"
                            }`}
                        >
                            <FiLock className="text-lg" />
                            Change Password
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default EmployeeSidebar;
