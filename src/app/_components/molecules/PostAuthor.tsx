import Image from 'next/image';

import { AppLink } from '~/app/_components/atoms/AppLink';

type Favicon = {
  src: string;
  title: string;
};

const favicons: Partial<Record<string, Favicon>> = {
  'furaffinity.net': {
    src: '/furaffinity-favicon.ico',
    title: 'FurAffinity',
  },
};

export const PostAuthor = ({ sourceUrl, name, authorUrl }: PostAuthorProps) => {
  const favicon = favicons[new URL(sourceUrl).hostname];

  return (
    <>
      {favicon && (
        <AppLink.External href={sourceUrl}>
          <Image
            src={favicon.src}
            alt={favicon.title}
            title={favicon.title}
            className="inline"
            width={16}
            height={16}
            unoptimized
          />
        </AppLink.External>
      )}
      {favicon && ' '}

      <AppLink.External href={authorUrl}>
        <strong>{name}{', '}</strong>
      </AppLink.External>
    </>
  );
}

export interface PostAuthorProps {
  sourceUrl: string;
  authorUrl: string;
  name: string;
}
