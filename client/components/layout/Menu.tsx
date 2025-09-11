import { usePathname } from "next/navigation";
import React from "react";
import { sidebarLinks } from "@/constants";
import Link from "next/link";

const Menu = () => {
  const pathName = usePathname();
  
  return (
    <div className="space-y-1">
      <h4 className="text-light-3 text-small-semibold uppercase tracking-wider px-3 mb-4">
        Navigation
      </h4>
      {sidebarLinks.map((link) => {
        const isActive = pathName === link.route;
        return (
          <Link
            key={link.label}
            href={link.route}
            className={`group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
              isActive 
                ? "bg-gradient-to-r from-purple-1 to-pink-1 text-white shadow-lg" 
                : "text-light-2 hover:bg-dark-1 hover:text-light-1"
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
              isActive 
                ? "bg-white/20" 
                : "group-hover:bg-purple-1/20"
            }`}>
              {React.cloneElement(link.icon, {
                sx: {
                  fontSize: "20px",
                  color: isActive ? "white" : "inherit"
                }
              })}
            </div>
            <span className="text-small-bold flex-1">{link.label}</span>
            {isActive && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default Menu;
