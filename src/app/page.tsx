import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  await api.postQueue.search({});

  return (
    <HydrateClient>
      <MainLayout.Body>
        <Typography.H1>Home page under construction</Typography.H1>
      </MainLayout.Body>
    </HydrateClient>
  );
}
