import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  const postQueues = await api.postQueue.find();

  return (
    <HydrateClient>
      <MainLayout.Body>

      </MainLayout.Body>

      <MainLayout.SidePanel title="Search">

      </MainLayout.SidePanel>
    </HydrateClient>
  );
}
