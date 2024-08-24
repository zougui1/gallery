import { PostSelectorClear, type PostSelectorClearProps } from './PostSelectorClear';
import { PostSelectorLink, type PostSelectorLinkProps } from './PostSelectorLink';
import { PostSelectorTrigger, type PostSelectorTriggerProps } from './PostSelectorTrigger';
import { PostSelectorRoot, type PostSelectorRootProps } from './PostSelectorRoot';

export const PostSelector = {
  Root: PostSelectorRoot,
  Link: PostSelectorLink,
  Clear: PostSelectorClear,
  Trigger: PostSelectorTrigger,
};

export type {
  PostSelectorClearProps,
  PostSelectorLinkProps,
  PostSelectorTriggerProps,
  PostSelectorRootProps,
};
