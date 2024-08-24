import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import { MainLayout, cn } from '@zougui/react.ui';

import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Gallery',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, 'dark')}>
      <body>
        <TRPCReactProvider>
          <MainLayout.Screen>
            <MainLayout.Container>
              {children}
            </MainLayout.Container>
          </MainLayout.Screen>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
