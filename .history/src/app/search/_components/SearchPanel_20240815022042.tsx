'use client';

import { MainLayout } from '@zougui/react.ui';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ButtonLink } from '~/app/_components/atoms/ButtonLink';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';

export const SearchPanel = () => {
  const searchParams = useSearchParams();
  const urlKeywords = searchParams.get('keywords')?.split(',') ?? [];
  const [keywords, setKeywords] = useState<string[]>(urlKeywords);

  return (
    <MainLayout.SidePanel className="max-w-64 w-full flex flex-col gap-6">
      <div>
        <ButtonLink.Internal href={`/search?keywords=${keywords.join(',')}`}>
          Search
        </ButtonLink.Internal>
      </div>

      <div>
        <KeywordAutocomplete
          values={keywords}
          onValuesChange={keywords => setKeywords(keywords.map(String))}
          placeholder="Keywords"
          multiple
        />
      </div>
    </MainLayout.SidePanel>
  );
}
