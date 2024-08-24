import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Form } from '@zougui/react.ui';
import { api } from '~/trpc/react';
import { nullifyEmptyString } from '~/utils';

import { type SeriesData } from './SeriesTable';
import { nanoid } from 'nanoid';

const seriesSchema = z.object({
  _id: z.string(),
  url: z.string().url().min(1),
  keywords: z.array(z.string().min(1)).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  attachmentUrl: z.preprocess(nullifyEmptyString, z.string().url().optional()),
  chapterIndex: z.coerce.number().min(1).int(),
  partIndex: z.coerce.number().min(1).int(),
});

export const SeriesFormDialog = ({ children, onSubmit, defaultValues }: SeriesFormDialogProps) => {
  const form = useForm<z.infer<typeof seriesSchema>>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      _id: defaultValues._id ?? nanoid(),
      url: defaultValues.url ?? '',
      keywords: defaultValues.keywords ?? [],
      title: defaultValues.title ?? '',
      description: defaultValues.description ?? '',
      attachmentUrl: defaultValues.attachmentUrl ?? '',
      chapterIndex: defaultValues.chapterIndex ?? 1,
      partIndex: defaultValues.partIndex ?? 1,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();

  return (
    <Dialog.Root>
      {children}

      <Dialog.Content className="max-w-xl">
        <Form.Root {...form}>
          <form>
            <Dialog.Header>
              <Dialog.Title>Series</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <fieldset className="space-y-6">
                <Form.Input
                  control={form.control}
                  name="url"
                  label="URL"
                />

                <Form.Input
                  control={form.control}
                  name="chapterIndex"
                  label="Chapter"
                />

                <Form.Input
                  control={form.control}
                  name="partIndex"
                  label="Part"
                />

                <Form.Input
                  control={form.control}
                  name="attachmentUrl"
                  label="Attachment URL"
                />

                <Form.Autocomplete.Root
                  control={form.control}
                  name="keywords"
                  label="Keywords"
                  multiple
                  creatable
                >
                  {keywords.map(keyword => (
                    <Form.Autocomplete.Item key={keyword} value={keyword}>
                      {keyword}
                    </Form.Autocomplete.Item>
                  ))}
                </Form.Autocomplete.Root>

                <Form.Input
                  control={form.control}
                  name="title"
                  label="Title"
                />

                <Form.Textarea
                  control={form.control}
                  name="description"
                  label="Description"
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

SeriesFormDialog.Trigger = Dialog.Trigger;

export interface SeriesFormDialogProps {
  children?: React.ReactNode;
  onSubmit: (data: z.infer<typeof seriesSchema>) => void;
  defaultValues: Partial<SeriesData>;
}
