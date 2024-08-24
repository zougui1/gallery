'use client';

import { Button, MainLayout } from '@zougui/react.ui';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AppLink } from '~/app/_components/atoms/AppLink';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';

export const SearchPanel = () => {
  const searchParams = useSearchParams();
  const urlKeywords = searchParams.get('keywords')?.split(',') ?? [];
  const [keywords, setKeywords] = useState<string[]>(urlKeywords);

  return (
    <MainLayout.SidePanel className="max-w-64 w-full">
      <KeywordAutocomplete
        values={keywords}
        onValuesChange={keywords => setKeywords(keywords.map(String))}
        placeholder="Keywords"
        multiple
      />

      <Button asChild>
        <AppLink.Internal href={`/search?keywords=${keywords.join(',')}`}>Search</AppLink.Internal>
      </Button>
    </MainLayout.SidePanel>
  );
}
