import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Form } from '@zougui/react.ui';
import { api } from '~/trpc/react';
import { nullifyEmptyString } from '~/utils';

import { type SeriesData } from './SeriesTable';

const chapterSchema = z.object({
  title: z.string().optional(),
  chapterIndex: z.number().min(1).int(),
});

export const ChapterFormDialog = ({ children, onSubmit, defaultValues }: ChapterFormDialogProps) => {
  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: defaultValues.title ?? '',
      chapterIndex: defaultValues.chapterIndex ?? 1,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Form.Root {...form}>
          <form>
            <Dialog.Header>
              <Dialog.Title>Comic chapter</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <fieldset className="space-y-6">
                <Form.Input
                  control={form.control}
                  name="chapterIndex"
                  label="Chapter"
                />

                <Form.Input
                  control={form.control}
                  name="title"
                  label="Title"
                />
              </fieldset>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={handleSubmit}>
                Submit
              </Button>

              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface ChapterFormDialogProps {
  children: React.ReactNode;
  onSubmit: (data: z.infer<typeof chapterSchema>) => void;
  defaultValues: Partial<SeriesData>;
  partLabel: string;
}
