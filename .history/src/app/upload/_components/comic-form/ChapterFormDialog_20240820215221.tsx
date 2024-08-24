import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Form, Typography } from '@zougui/react.ui';

import { type ChapterData } from './ChapterTable';
import { PageTable } from './PageTable';
import { pageSchema } from './PageFormDialog';
import { nanoid } from 'nanoid';

const chapterSchema = z.object({
  _id: z.string(),
  title: z.string().optional(),
  chapterIndex: z.coerce.number().min(1).int(),
  pages: z.array(pageSchema),
});

export const ChapterFormDialog = ({ children, onSubmit, defaultValues }: ChapterFormDialogProps) => {
  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      _id: defaultValues._id ?? nanoid(),
      title: defaultValues.title ?? '',
      chapterIndex: defaultValues.chapterIndex ?? 1,
      pages: defaultValues.pages ?? [],
    },
  });

  const pages = form.watch('pages');
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Dialog.Root>
      {children}

      <Dialog.Content className="min-w-96">
        <Form.Root {...form}>
          <form>
            <Dialog.Header>
              <Dialog.Title>Comic chapter</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body className="space-y-6">
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

              <div>
                <Typography.H4 className="text-center">Pages</Typography.H4>

                <PageTable
                  pages={pages}
                  onPagesChange={pages => form.setValue('pages', pages)}
                  defaultValues={{
                    partIndex: pages.length + 1,
                    keywords: defaultValues?.keywords,
                  }}
                />
              </div>
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

ChapterFormDialog.Trigger = Dialog.Trigger;

export interface ChapterFormDialogProps {
  children?: React.ReactNode;
  onSubmit: (data: z.infer<typeof chapterSchema>) => void;
  defaultValues: Partial<ChapterData & { keywords: string[] }>;
}
