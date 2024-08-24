import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  await api.postQueue.find();

  return (
    <HydrateClient>
      <MainLayout.Body>

      </MainLayout.Body>

      <MainLayout.SidePanel title="Search">

      </MainLayout.SidePanel>
    </HydrateClient>
  );
}
