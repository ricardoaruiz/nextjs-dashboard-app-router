import {
  DocumentDuplicateIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "./nav-link";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
];

export default async function NavLinks() {
  async function getItems(): Promise<typeof links> {
    "use server";
    // Simulate an API call to fetch links
    // In a real application, you would replace this with an actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(links);
      }, 500);
    });
  }

  const navLinks = await getItems();

  return (
    <>
      {navLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <NavLink key={link.name} href={link.href}>
            <LinkIcon className="h-6" />
            <p className="hidden md:block">{link.name}</p>
          </NavLink>
        );
      })}
    </>
  );
}
