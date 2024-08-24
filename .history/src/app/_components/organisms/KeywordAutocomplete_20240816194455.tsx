'use client';

import { Autocomplete, cn, type AutocompleteRootProps } from '@zougui/react.ui';

import { api } from '~/trpc/react';

export const KeywordAutocomplete = ({ values, excludedKeywords, className, placeholder, ...rest }: KeywordAutocompleteProps) => {
  const { data: allKeywords, isLoading } = api.post.findAllKeywords.useQuery();
  const keywordSuggestions = excludedKeywords && excludedKeywords.length > 0
    ? allKeywords?.filter(keyword => !excludedKeywords.includes(keyword))
    : allKeywords;

  return (
    <Autocomplete.Root {...rest} values={values}>
      <Autocomplete.Trigger className={cn('w-[220px]', className)}>
        <Autocomplete.Value placeholder={placeholder} />
      </Autocomplete.Trigger>

      <Autocomplete.Content className="w-[220px] p-0">
        <Autocomplete.Input placeholder="Search" />

        <Autocomplete.List>
          <Autocomplete.Empty>
            {isLoading ? 'Loading...' : 'No results.'}
          </Autocomplete.Empty>

          <Autocomplete.NewItems heading="New" />

          {values.map(selectedKeyword => (
            <Autocomplete.Item key={selectedKeyword} value={selectedKeyword}>
              <span className="break-words overflow-x-hidden">
                {selectedKeyword}
              </span>
            </Autocomplete.Item>
          ))}

          {keywordSuggestions?.filter(k => !values.includes(k)).map(keyword => (
            <Autocomplete.Item key={keyword} value={keyword}>
              <span className="break-words overflow-x-hidden">
                {keyword}
              </span>
            </Autocomplete.Item>
          ))}
        </Autocomplete.List>
      </Autocomplete.Content>
    </Autocomplete.Root>
  );
}

export interface KeywordAutocompleteProps extends AutocompleteRootProps {
  excludedKeywords?: string[];
  className?: string;
  placeholder?: string;
}
