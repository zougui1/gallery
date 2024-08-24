import { cn, MainLayout } from '@zougui/react.ui';
import Link from 'next/link';
import { ImagePlay } from 'lucide-react';

import { PostRating } from '~/enums';

import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  const posts = await api.post.find();

  return (
    <HydrateClient>
      <MainLayout.Body>
        <div className="flex gap-4 flex-wrap">
          {posts.map(post => (
            <div key={post._id}>
              {
                // TODO link
              }
              <Link href="#" className="relative">
                <picture>
                  <source srcSet={`/api/media/${post.thumbnail.small.fileName}`} />
                  <img
                    src={`/api/media/${post.thumbnail.original.fileName}`}
                    alt={post.keywords.join(', ')}
                    className={cn(
                      'max-w-96 max-h-96 border rounded-md transition-all',
                      'hover:brightness-90',
                      post.rating === PostRating.sfw && 'border-gray-600',
                      post.rating === PostRating.nsfw && 'border-red-600',
                    )}
                  />
                </picture>

                <ImagePlay className="w-6 absolute bottom-2 right-2" />
              </Link>
            </div>
          ))}
        </div>
      </MainLayout.Body>
    </HydrateClient>
  );
}
