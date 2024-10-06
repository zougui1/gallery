'use client';

import { PostSelectorProvider, type PostSelectorProviderProps } from './context';

export const PostSelectorRoot = (props: PostSelectorRootProps) => {
  return (
    <PostSelectorProvider {...props} />
  );
}

export interface PostSelectorRootProps extends PostSelectorProviderProps {

}
