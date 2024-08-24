import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { UploadForm } from './_components/UploadForm';

export default async function Upload() {
  const postQueues = await api.postQueue.find();

  return (
    <HydrateClient>
      <MainLayout.Body title="Upload">
        <UploadForm />
      </MainLayout.Body>
    </HydrateClient>
  );
}
