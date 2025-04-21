"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type NavLinkProps = ComponentProps<typeof Link> & {
  href: string;
};

export function NavLink({ href, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={clsx(
        "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
        { "bg-sky-100": pathname === href }
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
