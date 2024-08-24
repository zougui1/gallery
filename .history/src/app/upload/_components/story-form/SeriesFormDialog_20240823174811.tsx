import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { type PartialDeep } from 'type-fest';

import { Button, Dialog, Form } from '@zougui/react.ui';
import { api } from '~/trpc/react';
import { nullifyEmptyString } from '~/utils';
import { PostSeriesType } from '~/enums';

import { type SeriesData } from './SeriesTable';

const seriesSchema = z.object({
  url: z.string().url().min(1),
  keywords: z.array(z.string().min(1)),
  title: z.string().optional(),
  description: z.string().optional(),
  attachmentUrl: z.preprocess(nullifyEmptyString, z.string().url().optional()),
  series: z.object({
    id: z.string().min(1),
    type: z.enum(Object.values(PostSeriesType) as [PostSeriesType, ...PostSeriesType[]]),
    name: z.string(),
    chapterIndex: z.coerce.number().min(1).int(),
    partIndex: z.coerce.number().min(1).int(),
  }),
});

export const SeriesFormDialog = ({ children, onSubmit, defaultValues }: SeriesFormDialogProps) => {
  const form = useForm<z.infer<typeof seriesSchema>>({
    resolver: zodResolver(seriesSchema),
    defaultValues: {
      url: defaultValues?.url ?? '',
      keywords: defaultValues?.keywords ?? [],
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      attachmentUrl: defaultValues?.attachmentUrl ?? '',
      series: {
        id: defaultValues?.series?.id ?? nanoid(),
        type: defaultValues?.series?.type ?? PostSeriesType.story,
        chapterIndex: defaultValues?.series?.chapterIndex ?? 1,
        partIndex: defaultValues?.series?.partIndex ?? 1,
      },
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();

  return (
    <Dialog.Root>
      {children}

      <Dialog.Content className="max-w-4xl">
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
                  name="series.chapterIndex"
                  label="Chapter"
                />

                <Form.Input
                  control={form.control}
                  name="series.partIndex"
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
  defaultValues?: PartialDeep<SeriesData>;
}
