'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';

import { Button, Dialog, Typography, type DialogRootProps } from '@zougui/react.ui';

import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { AltTable } from '~/app/upload/_components/AltTable';
import { api } from '~/trpc/react';
import { type SubmissionUploadSchema } from '~/schemas/upload';
import { type PostSchemaWithId } from '~/server/database';

const AltGallery = ({ id }: { id: string }) => {
  const [currentAlts] = api.post.findByAltId.useSuspenseQuery({ id });

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {!currentAlts.length && (
        <Typography.Paragraph>No alts</Typography.Paragraph>
      )}

      {currentAlts.map(alt => (
        <PostThumbnail.Root key={alt._id} post={alt}>
          <PostThumbnail.Image />
          <PostThumbnail.Title>{alt.alt?.label}</PostThumbnail.Title>
        </PostThumbnail.Root>
      ))}
    </div>
  );
}

export const AddAltsFormDialog = ({ post, onOpenChange, ...rest }: AddAltsFormDialogProps) => {
  const [newAlts, setNewAlts] = useState<Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>[]>([]);

  const utils = api.useUtils();
  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });
  const setAltMutation = api.post.setAlt.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const addAlts = () => {
    onOpenChange?.(false);

    const altId = post.alt?.id ?? nanoid();
    const now = Date.now();

    creationMutation.mutate(newAlts.map((alt, index) => {
      return {
        ...alt,
        series: post.series,
        createdAt: new Date(now + index),
        alt: {
          id: altId,
          label: alt.alt.label,
        },
      };
    }));

    if (!post.alt) {
      setAltMutation.mutate({
        sourceUrl: post.sourceUrl,
        alt: {
          id: altId,
          label: 'Original',
        },
      });
    }

    setNewAlts([]);
  }

  return (
    <Dialog.Root {...rest} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-4xl">
        <Dialog.Header>
          <Dialog.Title>Add alts</Dialog.Title>
          <Dialog.Description>Add alts to the current post</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="space-y-4">
          <div>
            <Typography.H4>New alts</Typography.H4>

            <AltTable
              alts={newAlts}
              defaultValue={{
                keywords: post.keywords,
              }}
              onAltsChange={setNewAlts}
            />
          </div>

          <div>
            <Typography.H4 className="pb-2">Current alts</Typography.H4>
            {post.alt && <AltGallery id={post.alt.id} />}
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Close</Button>
          </Dialog.Close>

          <Button onClick={addAlts}>Add new alts</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface AddAltsFormDialogProps extends DialogRootProps {
  post: PostSchemaWithId;
}
