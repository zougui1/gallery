'use client';

import { z } from 'zod';

import { Button, Dialog, type DialogRootProps, Form } from '@zougui/react.ui';

import { type PostSchemaWithId } from '~/server/database';
import { nullifyEmptyString } from '~/utils';
import { useAppForm } from '~/app/_hooks';
import { api } from '~/trpc/react';
import { nanoid } from 'nanoid';
import { PostSeriesType } from '~/enums';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  comicName: z.preprocess(nullifyEmptyString, z.string()),
  chapterName: z.string().optional(),
});

export const ConvertToComicDialog = ({ post, onOpenChange, ...rest }: ConvertToComicDialogProps) => {
  const form = useAppForm({
    schema: formSchema,
    defaultValues: {
      comicName: post.title,
      chapterName: '',
    },
  });

  const router = useRouter();
  const utils = api.useUtils();

  const setSeriesMutation = api.post.setSeries.useMutation({
    onSuccess: async () => {
      await Promise.allSettled([
        utils.post.invalidate(),
        utils.postQueue.invalidate(),
      ]);

      router.refresh();
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    setSeriesMutation.mutate({
      sourceUrl: post.sourceUrl,
      series: {
        id: nanoid(),
        name: data.comicName,
        chapterName: data.chapterName,
        type: PostSeriesType.comic,
        chapterIndex: 1,
        partIndex: 1,
      },
    });

    onOpenChange?.(false);
  });

  return (
    <Dialog.Root {...rest} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Convert to a comic</Dialog.Title>
          <Dialog.Description>This will create a new comic with this post for first page</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body>
          <Form.Root {...form}>
            <form className="flex flex-col gap-4">
              <Form.Input
                control={form.control}
                name="comicName"
                label="Comic name"
              />

              <Form.Input
                control={form.control}
                name="chapterName"
                label="Chapter name"
              />
            </form>
          </Form.Root>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>

          <Button onClick={handleSubmit}>Convert to a comic</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

ConvertToComicDialog.Trigger = Dialog.Trigger;

export interface ConvertToComicDialogProps extends DialogRootProps {
  post: PostSchemaWithId;
}
