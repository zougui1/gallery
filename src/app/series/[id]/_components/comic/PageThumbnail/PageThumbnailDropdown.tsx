'use client';

import { ChevronDown } from 'lucide-react';

import { Dropdown, IconButton } from '@zougui/react.ui';

export const PageThumbnailDropdown = () => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <IconButton className="p-0">
          <ChevronDown />
        </IconButton>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item>Add alts</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
