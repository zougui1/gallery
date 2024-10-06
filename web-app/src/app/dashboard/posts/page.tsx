import { MainLayout } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { getNumber, getValueFromEnum } from '~/utils';
import { PostQueueStatus } from '~/enums';

import { PostTable } from './_components/PostTable';
import { PostFilers } from './_components/PostFilters';

export const metadata = {
  title: 'Posts - Gallery',
  description: 'Posts',
};

export default async function Posts({ searchParams }: PostsProps) {
  const page = Math.max(getNumber(searchParams.page) ?? 1, 1);
  const status = getValueFromEnum(PostQueueStatus, searchParams.status);

  await api.postQueue.search({ page, status });

  return (
    <HydrateClient>
      <MainLayout.Body title="Posts">
        <PostTable />
      </MainLayout.Body>

      <MainLayout.SidePanel title="Filters">
        <PostFilers />
      </MainLayout.SidePanel>
    </HydrateClient>
  );
}

type PostsProps = {
  searchParams: Partial<{
    page: string;
    status: PostQueueStatus;
  }>;
};
