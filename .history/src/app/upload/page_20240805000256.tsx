import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  const postQueues = await api.postQueue.find();

  return (
    <HydrateClient>
      <MainLayout.Body title="Upload">

      </MainLayout.Body>
    </HydrateClient>
  );
}
