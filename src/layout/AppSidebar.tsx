"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  UsersIcon,
  FileTextIcon,
  Package,
  Blocks,
  Briefcase,
  ShieldUser,
  SettingsIcon,
  Bell
} from "../icons/index";
import { usePermissions } from "@/context/PermissionsContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean; permission?: string }[];
  permission?: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Business Overview", path: "/", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

const section2NavItems: NavItem[] = [
  {
    icon: <UsersIcon />,
    name: "Customer Management",
    permission: "customers.index||customers.show||customers.store||customers.update||customers.destroy",
    subItems: [
      { name: "View all customers", path: "/", pro: false, permission: "customers.show" },
    ],
  },
  {
    icon: <FileTextIcon />,
    name: "Order Management",
    permission: "orders.index||orders.store||orders.show||orders.update||orders.destroy",
    subItems: [
      { name: "List of all orders", path: "/all-orders", pro: false, permission: "orders.index" },
      { name: "Create new Order", path: "/new-order", pro: false, permission: "orders.store" }
    ],
  },
  {
    icon: <Package />,
    name: "Order Item Management",
    permission: "order-items.index||order-items.store||order-items.show||order-items.update||order-items.destroy",
    subItems: [
      { name: "View order items", path: "/", pro: false, permission: "order-items.index" },
      { name: "Add new order item", path: "/", pro: false, permission: "order-items.store" }
    ],
  }
];

const section3NavItems: NavItem[] = [
  {
    icon: <BoxCubeIcon />,
    name: "Inventory Management",
    permission: "stock-items.index||stock-items.store||stock-items.show||stock-items.update||stock-items.destroy",
    subItems: [
      { name: "View stock items", path: "/line-chart", pro: false, permission: "stock-items.index" },
      { name: "Add new stock item", path: "/line-chart", pro: false, permission: "stock-items.store" },
    ],
  },
  {
    icon: <Blocks />,
    name: "Service & Pricing",
    subItems: [
      { name: "Availbale Services", path: "/available-services", pro: false },
      { name: "Add New Services", path: "/add-services", pro: false },
    ],
  },
  {
    icon: <Briefcase />,
    name: "Staff Pannel",
    subItems: [
      { name: "Assign Orders to washers", path: "/line-chart", pro: false }
    ],
  }
];

const section4NavItems: NavItem[] = [
  {
    icon: <ShieldUser />,
    name: "Roles & Permissions",
    permission: "roles.index||roles.store||roles.show||roles.update||roles.destroy",
    subItems: [
      { name: "View roles and permissions", path: "/all-roles", pro: false, permission: "roles.index" },
      { name: "Create new roles", path: "/role-create", pro: false, permission: "roles.store" },
    ],
  }
];

const section5NavItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Report Section",
    subItems: [
      { name: "Most frequent customers", path: "/", pro: false },
      { name: "Most oredered items", path: "/", pro: false },
      { name: "Sales report", path: "/", pro: false }
    ],
  },
  {
    icon: <Bell />,
    name: "Notifications & Alerts",
    subItems: [
      { name: "Low stock alert", path: "/", pro: false }
    ],
  },
];

const section6NavItems: NavItem[] = [
  {
    icon: <SettingsIcon />,
    name: "Settings",
    subItems: [
      { name: "Set shop & currency", path: "/", pro: false },
      { name: "SMS and email config", path: "/", pro: false }
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];

const section7NavItems: NavItem[] = [
  {
    icon: <UsersIcon />,
    name: "User Management",
    permission: "users.index||users.show||users.store||users.update||users.destroy",
    subItems: [
      { name: "View all Users", path: "/", pro: false, permission: "users.show" },
      { name: "Add New User", path: "/add-user", pro: false, permission: "register" },
    ],
  }
];

const othersItems: NavItem[] = [
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/add-user", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { hasPermission} = usePermissions();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others" | "section2" | "section3" | "section4" | "section5" | "section6" | "section7" | "others"  
  ) => (
    <ul className="flex flex-col gap-4">
        {navItems
        .filter(navItem =>
          !navItem.permission ||
          navItem.permission.split("||").some(p => hasPermission(p.trim()))
        )
        .map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems
                  .filter(subItem => !subItem.permission || hasPermission(subItem.permission))
                  .map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "section2" | "section3" | "section4" | "section5" | "section6" | "section7" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "section2","section3", "section4", "section5", "section6", "section6", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems 
          : menuType === "section2" ? section2NavItems 
          : menuType === "section3" ? section3NavItems
          : menuType === "section4" ? section4NavItems
          : menuType === "section5" ? section5NavItems
          : menuType === "section6" ? section6NavItems
          : menuType === "section7" ? section7NavItems
          : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "section2" | "section3" | "section4" | "section5" | "section6" | "section7" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "section2" | "section3" | "section4" | "section5" | "section6" | "section7" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Main"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 
                (
                "users.index||users.show||users.store||users.update||users.destroy"
                  .split("||")
                  .some(p => hasPermission(p.trim()))
                ? "User" : null) 
                : (<HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(section7NavItems, "section7")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 
                ("customers.index||customers.show||customers.store||customers.update||customers.destroy" 
                .split("||")
                  .some(p => hasPermission(p.trim()))
                ? "Customer Operations" : null
                ):(<HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(section2NavItems, "section2")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 
                (
                  "Services & Staff"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(section3NavItems, "section3")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 
                ("roles.index||roles.store||roles.show||roles.update||roles.destroy"
                  .split("||")
                  .some(p => hasPermission(p.trim()))
                  ? "Access Controll" : null
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(section4NavItems, "section4")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Reports & Alerts"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(section5NavItems, "section5")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Configuration"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(section6NavItems, "section6")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>

          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
