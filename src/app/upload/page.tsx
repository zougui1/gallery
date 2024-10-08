import { type Metadata } from 'next';

import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';

import { UploadForm } from './_components/UploadForm';

export const metadata: Metadata = {
  title: 'Upload - Gallery',
};

export default async function Upload() {
  await api.postQueue.search({});

  return (
    <HydrateClient>
      <MainLayout.Body title="Upload">
        <UploadForm />
      </MainLayout.Body>
    </HydrateClient>
  );
}
