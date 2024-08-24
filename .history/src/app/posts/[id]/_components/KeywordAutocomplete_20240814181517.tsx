'use client';

import { useState } from 'react';

import { Autocomplete, type AutocompleteRootProps } from '@zougui/react.ui';

import { api } from '~/trpc/react';

export const KeywordAutocomplete = ({ excludedKeywords }: KeywordAutocompleteProps) => {
  const [tempKeywords, setTempKeywords] = useState<string[]>([]);

  const [allKeywords] = api.post.findAllKeywords.useSuspenseQuery();
  const keywordSuggestions = allKeywords.filter(keyword => !excludedKeywords.includes(keyword));

  return (
    <Autocomplete.Root
      values={tempKeywords}
      onValuesChange={values => setTempKeywords(values.map(String))}
      creatable
    >
      <Autocomplete.Trigger className="w-[250px]">
        <Autocomplete.Value />
      </Autocomplete.Trigger>

      <Autocomplete.Content className="w-[250px] p-0">
        <Autocomplete.Input placeholder="Search" />

        <Autocomplete.List>
          <Autocomplete.Empty>No results.</Autocomplete.Empty>
          <Autocomplete.NewItems heading="New" />

          {keywordSuggestions.map(keyword => (
            <Autocomplete.Item key={keyword} value={keyword}>
              {keyword}
            </Autocomplete.Item>
          ))}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}

export interface KeywordAutocompleteProps extends AutocompleteRootProps {
  excludedKeywords: string[];
}
