import { type Metadata } from 'next';

import { MainLayout, Typography } from '@zougui/react.ui';

import { api, HydrateClient } from '~/trpc/server';
import { PostSeriesType } from '~/enums';

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
  const [post] = await api.post.findBySeriesId({ id: params.id });

  return (
    <HydrateClient>
      <MainLayout.Body className="w-full">
        {!post?.series && (
          <Typography.H1>This series does not exist.</Typography.H1>
        )}

        {post?.series?.type === PostSeriesType.comic && <Comic seriesId={params.id} />}
      </MainLayout.Body>
    </HydrateClient>
  );
}
