'use client';

import Link from 'next/link';

import { NavigationMenu } from '@zougui/react.ui';
import React from 'react';

type Link = {
  href: string;
  label: string;
};

type NavItem = Link | {
  label: string;
  links: Link[];
};

const links: NavItem[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/search',
    label: 'Search',
  },
  {
    href: '/upload',
    label: 'Upload',
  },
  {
    label: 'Dashboard',
    links: [
      {
        label: 'Posts',
        href: '/dashboard/posts',
      },
    ],
  },
];

const NavLink = ({ href, children }: { href: string; children?: React.ReactNode }) => {
  return (
    <NavigationMenu.LinkItem asChild>
      <Link href={href}>{children}</Link>
    </NavigationMenu.LinkItem>
  );
}

const NavLinkMenu = ({ links, children }: { links: Link[]; children?: React.ReactNode }) => {
  return (
    <NavigationMenu.Item className="relative">
      <NavigationMenu.Trigger>{children}</NavigationMenu.Trigger>

      <NavigationMenu.Content className="absolute top-4">
        <ul className="p-6 ">
          {links.map(link => (
            <li key={link.label}>
              <NavigationMenu.Link asChild>
                <Link href={link.href}>
                  {link.label}
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

export const Navbar = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        {links.map(item => (
          'links' in item
            ? <NavLinkMenu key={item.label} links={item.links}>{item.label}</NavLinkMenu>
            : <NavLink key={item.label} href={item.href}>{item.label}</NavLink>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
