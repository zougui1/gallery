'use client';

import { MainLayout } from '@zougui/react.ui';
import { useState } from 'react';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';

export const SearchPanel = () => {
  const [keywords, setKeywords] = useState<string[]>([]);

  return (
    <MainLayout.SidePanel className="max-w-64 w-full">
      <KeywordAutocomplete
        values={keywords}
        onValuesChange={keywords => setKeywords(keywords.map(String))}
        placeholder="Keywords"
      />
    </MainLayout.SidePanel>
  );
}
