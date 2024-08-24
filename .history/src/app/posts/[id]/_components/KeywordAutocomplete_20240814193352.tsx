'use client';

import { Autocomplete, type AutocompleteRootProps } from '@zougui/react.ui';

import { api } from '~/trpc/react';

export const KeywordAutocomplete = ({ excludedKeywords, ...rest }: KeywordAutocompleteProps) => {
  const { data: allKeywords, isLoading } = api.post.findAllKeywords.useQuery();
  const keywordSuggestions = excludedKeywords && excludedKeywords.length > 0
    ? allKeywords?.filter(keyword => !excludedKeywords.includes(keyword))
    : allKeywords;

  return (
    <Autocomplete.Root {...rest}>
      <Autocomplete.Trigger className="w-[220px]">
        <Autocomplete.Value />
      </Autocomplete.Trigger>

      <Autocomplete.Content className="w-[220px] p-0">
        <Autocomplete.Input placeholder="Search" />

        <Autocomplete.List>
          <Autocomplete.Empty>
            {isLoading ? 'Loading...' : 'No results.'}
          </Autocomplete.Empty>
          <Autocomplete.NewItems heading="New" />

          {keywordSuggestions?.map(keyword => (
            <Autocomplete.Item key={keyword} value={keyword} className="break-words">
              <span className="break-words">{keyword}</span>
            </Autocomplete.Item>
          ))}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}

export interface KeywordAutocompleteProps extends AutocompleteRootProps {
  excludedKeywords?: string[];
}
