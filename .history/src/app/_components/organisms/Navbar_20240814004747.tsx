'use client';

import Link from 'next/link';

import { NavigationMenu } from '@zougui/react.ui';

const links = [
  {
    href: '/home',
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
];

export const Navbar = () => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        {links.map(link => (
          <NavigationMenu.LinkItem key={link.href} asChild>
            <Link href={link.href}>{link.label}</Link>
          </NavigationMenu.LinkItem>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
