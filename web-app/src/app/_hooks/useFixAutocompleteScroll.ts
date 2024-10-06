'use client';

import { useRef } from 'react';

export const useFixAutocompleteScroll = (): UseFixAutocompleteScrollResult => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const fixScroll = () => {
    const scrollTop = listRef.current?.scrollTop;

    // fix the scroll back to top for better UX
    if (!scrollTop) {
      setTimeout(() => {
        listRef.current?.scrollTo({ top: 0 });
      }, 10);
    }
  }

  return [listRef, fixScroll];
}

export type UseFixAutocompleteScrollResult = [
  ref: React.MutableRefObject<HTMLDivElement | null>,
  fixScroll: () => void,
];
