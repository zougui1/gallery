'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

import { Autocomplete, IconButton, Typography } from '@zougui/react.ui';

import { AppLink } from '~/app/_components/atoms/AppLink';
import { api } from '~/trpc/react';

export const KeywordList = ({ keywords }: KeywordListProps) => {
  const [clientKeywords, setClientKeywords] = useState<string[]>([]);
  const [tempKeywords, setTempKeywords] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);

  const [allKeywords] = api.post.findAllKeywords.useSuspenseQuery();
  console.log('allKeywords:', allKeywords)
  const keywordSuggestions = allKeywords.filter(keyword => !keywords.includes(keyword));

  return (
    <div className="w-full flex flex-col">
      <Typography.H5 className="w-full flex justify-between items-center">
        <span>Keywords</span>

        <IconButton onClick={() => setShowInput(true)}>
          <Plus className="w-4 h-4" />
        </IconButton>
      </Typography.H5>

      {showInput && (
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
      )}

      <ul className="w-full">
        {keywords.slice().sort().map(keyword => (
          <li key={keyword} className="flex justify-between">
            <div>
              <AppLink.Internal href={`/search?keywords=${keyword}`}>
                {keyword}
              </AppLink.Internal>
            </div>

            <div>
              <IconButton size="sm">
                <X className="w-4 h-4 text-destructive" />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface KeywordListProps {
  keywords: string[];
}
