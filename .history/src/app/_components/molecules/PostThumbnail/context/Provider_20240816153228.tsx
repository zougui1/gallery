'use client';

import { createContext, useMemo } from 'react';

import { type PostSchemaWithId } from '~/server/database';

export interface PostThumbnailContextState {
  post: PostSchemaWithId;
}

export const PostThumbnailContext = createContext<PostThumbnailContextState | undefined>(undefined);

export const PostThumbnailProvider = ({ post, children }: PostThumbnailProviderProps) => {
  const state = useMemo(() => {
    return { post };
  }, [post]);

  return (
    <PostThumbnailContext.Provider value={state}>
      {children}
    </PostThumbnailContext.Provider>
  );
}

export interface PostThumbnailProviderProps extends PostThumbnailContextState {
  children?: React.ReactNode;
}
