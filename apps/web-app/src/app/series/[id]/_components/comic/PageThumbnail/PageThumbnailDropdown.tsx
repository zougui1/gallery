'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { Dropdown, IconButton } from '@zougui/react.ui';

import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';

import { AddAltsFormDialog } from '../AddAltsFormDialog';

export const PageThumbnailDropdown = () => {
  const [openAltsDialog, setOpenAltsDialog] = useState(false);
  const { post } = PostThumbnail.useState();

  return (
    <>
      <AddAltsFormDialog
        open={openAltsDialog}
        onOpenChange={setOpenAltsDialog}
        post={post}
      />

      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <IconButton className="p-0">
            <ChevronDown />
          </IconButton>
        </Dropdown.Trigger>

        <Dropdown.Content>
          <Dropdown.Item onClick={() => setOpenAltsDialog(true)}>Add alts</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
