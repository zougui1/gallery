'use client';

import { Dropdown, IconButton } from '@zougui/react.ui';
import { ChevronDown } from 'lucide-react';

export const PageDropdown = () => {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <IconButton className="p-0">
          <ChevronDown />
        </IconButton>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item>Add alt</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
