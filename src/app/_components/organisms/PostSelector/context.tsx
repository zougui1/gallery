'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { type PostSchemaWithId } from '~/server/database';

export interface PostSelectorState {
  posts: PostSchemaWithId[];
  selectPost: (post: PostSchemaWithId) => void;
  clearPosts: () => void;
}

export const PostSelectorContext = createContext<PostSelectorState | undefined>(undefined);

export const PostSelectorProvider = ({ children }: PostSelectorProviderProps) => {
  const [posts, setPosts] = useState<PostSchemaWithId[]>([]);

  const selectPost = (post: PostSchemaWithId) => {
    setPosts(prevPosts => {
      if (!prevPosts.some(prevPost => prevPost._id === post._id)) {
        return [...prevPosts, post];
      }

      return prevPosts.filter(prevPost => prevPost._id !== post._id);
    });
  }

  const clearPosts = () => {
    setPosts([]);
  }

  const state = useMemo(() => {
    return { posts, selectPost, clearPosts };
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

export const usePostSelector = (): PostSelectorState => {
  const context = useContext(PostSelectorContext);

  if (!context) {
    throw new Error('Cannot use post selector outside of the PostSelectorProvider tree');
  }

  return context;
}
