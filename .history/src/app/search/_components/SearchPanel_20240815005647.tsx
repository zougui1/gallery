'use client';

import { MainLayout } from '@zougui/react.ui';

import { KeywordAutocomplete } from '~/app/_components/organisms/KeywordAutocomplete';

export const SearchPanel = () => {
  return (
    <MainLayout.SidePanel className="max-w-48 w-full">
      <KeywordAutocomplete
      />
    </MainLayout.SidePanel>
  );
}
