import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { Comic } from './_components/comic/Comic';


type SeriesProps = {
  params: {
    id: string;
  };
};

export const generateMetadata = async ({ params }: SeriesProps): Promise<Metadata> => {
  const [post] = await api.post.findBySeriesId({ id: params.id });

  const titlePrefix = post?.series ? post.series.name : 'Series not found';

  return {
    title: `${titlePrefix} - Gallery`,
    description: 'Gallery',
  };
}

export default async function Series({ params }: SeriesProps) {
  const posts = await api.post.findBySeriesId({ id: params.id });

  return (
    <HydrateClient>
      <MainLayout.Body className="w-full">
        {!posts.length && (
          <Typography.H1>This series does not exist.</Typography.H1>
        )}

        {posts.length > 0 && <Comic seriesId={params.id} />}
      </MainLayout.Body>
    </HydrateClient>
  );
}
