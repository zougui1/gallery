'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { type PostSchemaWithId } from '~/server/database';

export interface PostSelectorContextState {
  posts: PostSchemaWithId[];
  selectPost: (post: PostSchemaWithId) => void;
}

export const PostSelectorContext = createContext<PostSelectorContextState | undefined>(undefined);

export const PostSelectorProvider = ({ children }: PostSelectorProviderProps) => {
  const [posts, setPosts] = useState<PostSchemaWithId[]>([]);

  const selectPost = (post: PostSchemaWithId) => {
    setPosts(prevPosts => {
      if (!prevPosts.some(prevPost => prevPost._id === post._id)) {
        return { ...prevPosts, post };
      }

      return prevPosts.filter(prevPost => prevPost._id !== post._id);
    });
  }

  const state = useMemo(() => {
    return { posts, selectPost };
  }, [posts]);

  return (
    <PostSelectorContext.Provider value={state}>
      {children}
    </PostSelectorContext.Provider>
  );
}

export interface PostSelectorProviderProps {
  children?: React.ReactNode;
}

export const usePostSelector = (): PostSelectorContextState => {
  const context = useContext(PostSelectorContext);

  if (!context) {
    throw new Error('Cannot use table outside of the PostSelectorProvider tree');
  }

  return context;
}
