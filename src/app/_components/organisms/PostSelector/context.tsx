'use client';

import { createContext, useCallback, useContext, useMemo, useState, useRef } from 'react';

import { toggleArrayItem } from '~/utils';
import { type PostSchemaWithId } from '~/server/database';

export interface PostSelectorState {
  postIds: string[];
  altIds: string[];
  seriesIds: string[];
  hasSelection: boolean;
  selectPost: (post: PostSchemaWithId) => void;
  selectAltId: (altId: string) => void;
  selectSeriesId: (seriesId: string) => void;
  clear: () => void;
  getSelectionType: (post: PostSchemaWithId) => PostSelectionType | undefined;
}

type InternalState = {
  posts: PostSchemaWithId[];
  altIds: string[];
  seriesIds: string[];
};

export type PostSelectionType = 'post' | 'alt' | 'series';

export const PostSelectorContext = createContext<PostSelectorState | undefined>(undefined);

export const PostSelectorProvider = ({ posts: controlledPosts, onPostsChange, children }: PostSelectorProviderProps) => {
  const [internalState, setInternalState] = useState<InternalState>({
    posts: [],
    altIds: [],
    seriesIds: [],
  });

  const onPostsChangeRef = useRef(onPostsChange);
  onPostsChangeRef.current = onPostsChange;

  const isControlled = Boolean(controlledPosts);
  const posts = controlledPosts ?? internalState.posts;

  const hasSelection = (
    posts.length > 0 &&
    internalState.altIds.length > 0 &&
    internalState.seriesIds.length > 0
  );

  const selectPost = useCallback((post: PostSchemaWithId) => {
    if (isControlled) {
      onPostsChangeRef.current?.(toggleArrayItem(posts, post, p => p._id));
    } else {
      setInternalState(prevState => {
        return {
          ...prevState,
          posts: toggleArrayItem(prevState.posts, post, p => p._id),
        };
      });
    }
  }, [isControlled, posts]);

  const selectAltId = useCallback((altId: string) => {
    if (isControlled) {
      return;
    }

    setInternalState(prevState => {
      const newAltIds = toggleArrayItem(prevState.altIds, altId);

      return {
        ...prevState,
        posts: newAltIds.includes(altId)
          ? prevState.posts.filter(post => post.alt?.id !== altId)
          : prevState.posts,
        altIds: newAltIds,
      };
    });
  }, [isControlled]);

  const selectSeriesId = useCallback((seriesId: string) => {
    if (isControlled) {
      return;
    }

    setInternalState(prevState => {
      const newSeriesIds = toggleArrayItem(prevState.seriesIds, seriesId);

      return {
        ...prevState,
        posts: newSeriesIds.includes(seriesId)
          ? prevState.posts.filter(post => post.series?.id !== seriesId)
          : prevState.posts,
        seriesIds: newSeriesIds,
      };
    });
  }, [isControlled]);

  const getSelectionType = useCallback((post: PostSchemaWithId): PostSelectionType | undefined => {
    if (post.series && internalState.seriesIds.includes(post.series.id)) {
      return 'series';
    }

    if (post.alt && internalState.altIds.includes(post.alt.id)) {
      return 'alt';
    }

    if (posts.some(p => p._id === post._id)) {
      return 'post';
    }
  }, [internalState, posts]);

  const clear = () => {
    setInternalState({ posts: [], altIds: [], seriesIds: [] });
  }

  const state = useMemo(() => {
    return {
      postIds: posts.map(post => post._id),
      altIds: internalState.altIds,
      seriesIds: internalState.seriesIds,
      hasSelection,
      selectPost,
      selectAltId,
      selectSeriesId,
      clear,
      getSelectionType,
    };
  }, [
    internalState,
    hasSelection,
    posts,
    getSelectionType,
    selectPost,
    selectAltId,
    selectSeriesId,
  ]);

  return (
    <PostSelectorContext.Provider value={state}>
      {children}
    </PostSelectorContext.Provider>
  );
}

export interface PostSelectorProviderProps {
  posts?: PostSchemaWithId[];
  onPostsChange?: (posts: PostSchemaWithId[]) => void;
  children?: React.ReactNode;
}

export const usePostSelector = (): PostSelectorState => {
  const context = useContext(PostSelectorContext);

  if (!context) {
    throw new Error('Cannot use post selector outside of the PostSelectorProvider tree');
  }

  return context;
}
