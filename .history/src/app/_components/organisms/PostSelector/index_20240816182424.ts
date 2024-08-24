import { PostSelectorLink, type PostSelectorLinkProps } from './PostSelectorLink';
import { PostSelectorTrigger, type PostSelectorTriggerProps } from './PostSelectorTrigger';
import { PostSelectorRoot, type PostSelectorRootProps } from './PostSelectorRoot';

export const PostSelector = {
  Root: PostSelectorRoot,
  Link: PostSelectorLink,
  Trigger: PostSelectorTrigger,
};

export type {
  PostSelectorLinkProps,
  PostSelectorTriggerProps,
  PostSelectorRootProps,
};
