import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';

import { Button, Dialog, Form, Typography } from '@zougui/react.ui';

import { nullifyEmptyString } from '~/utils';
import { api } from '~/trpc/react';
import { submissionUploadSchema } from '~/schemas/upload';

import { type PageData } from './PageTable';
import { AltTable } from '../AltTable';

export const pageSchema = z.object({
  _id: z.string(),
  url: z.string().url().min(1),
  keywords: z.array(z.string().min(1)),
  title: z.string().optional(),
  description: z.string().optional(),
  attachmentUrl: z.preprocess(nullifyEmptyString, z.string().url().optional()),
  partIndex: z.coerce.number().min(1).int(),
  label: z.string(),
  alts: z.array(submissionUploadSchema.asAlt.omit({ createdAt: true })),
});

export const PageFormDialog = ({ children, onSubmit, defaultValues }: PageFormDialogProps) => {
  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      _id: defaultValues._id ?? nanoid(),
      url: defaultValues.url ?? '',
      keywords: defaultValues.keywords ?? [],
      title: defaultValues.title ?? '',
      description: defaultValues.description ?? '',
      attachmentUrl: defaultValues.attachmentUrl ?? '',
      partIndex: defaultValues.partIndex ?? 1,
      alts: defaultValues.alts ?? [],
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
              <Dialog.Title>Comic page</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body className="space-y-6">
              <fieldset className="space-y-6">
                <Form.Input
                  control={form.control}
                  name="url"
                  label="URL"
                />

                <Form.Input
                  control={form.control}
                  name="partIndex"
                  label="Page"
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

                {form.watch('alts').length > 0 && (
                  <Form.Input
                    control={form.control}
                    name="label"
                    label="Alt label"
                  />
                )}
              </fieldset>

              <div>
                <Typography.H4 className="text-center">Alts</Typography.H4>

                <AltTable
                  alts={form.watch('alts')}
                  onAltsChange={alts => form.setValue('alts', alts)}
                  defaultValue={form.watch()}
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

PageFormDialog.Trigger = Dialog.Trigger;

export interface PageFormDialogProps {
  children?: React.ReactNode;
  onSubmit: (data: z.infer<typeof pageSchema>) => void;
  defaultValues: Partial<PageData>;
}
