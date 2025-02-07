"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";

export const SideBarItem = ({
    href,
    title,
    icon,
    isOpen,
}: {
    href: string;
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
}) => {
    const pathname = usePathname();
    const selected = pathname === href;

    const handleClick = (e: React.MouseEvent) => {
        if (href === "/signout") {
            e.preventDefault();
            signOut({ callbackUrl: "/signin" });
        }
    };

    return (
        <Link
            className={`flex items-center mt-1 py-3 p-3 mr-3 -ml-1 rounded-lg transition-all duration-300 
            ${selected ? "bg-[#E5E7EB] scale-105 text-[#1F2937]" : "hover:bg-[#D1D5DB] text-[#6B7280]"}`}
            href={href}
            onClick={handleClick}>
            <div
                className={`${!isOpen ? "pl-0 sm:pl-3" : ""} transition-all duration-300 text-2xl ${selected ? "text-slate-700" : "text-slate-500"
                    }`}>
                {icon}
            </div>
            <div
                className={`${!isOpen ? "scale-0" : "scale-100"
                    } transition-all duration-300 font-bold ml-2 ${selected ? "text-[#222222]" : "text-slate-500"
                    }`}>
                {title}
            </div>
        </Link>
    );
};
