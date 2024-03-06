import React from "react";
import Link from "next/link";
import MobileNv from "./MobileNav";
import NavItems from "./NavItems";

const Sidebar = () => {
  return (
    <>
      <MobileNv />
      <aside
        id="sidebar-multi-level-sidebar"
        className={`hidden md:block z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 space-y-2">
          <Link
            href={"/"}
            className="flex items-center p-2 text-gray-900 rounded-lg"
          >
            <span className="ms-3 font-bold text-2xl">GrowonsMedia</span>
          </Link>
          <NavItems />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
