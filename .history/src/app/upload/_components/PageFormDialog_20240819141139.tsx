import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Form } from '@zougui/react.ui';

import { nullifyEmptyString } from '~/utils';
import { api } from '~/trpc/react';

import { type PageData } from './PageTable';

const pageSchema = z.object({
  url: z.string().url().min(1),
  keywords: z.array(z.string().min(1)).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  attachmentUrl: z.preprocess(nullifyEmptyString, z.string().url().optional()),
  partIndex: z.number().min(1).int(),
});

export const PageFormDialog = ({ children, onSubmit, defaultValues }: PageFormDialogProps) => {
  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      url: defaultValues.url ?? '',
      keywords: defaultValues.keywords ?? [],
      title: defaultValues.title ?? '',
      description: defaultValues.description ?? '',
      attachmentUrl: defaultValues.attachmentUrl ?? '',
      partIndex: defaultValues.partIndex ?? 1,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Content>
        <Form.Root {...form}>
          <form>
            <Dialog.Header>
              <Dialog.Title>Comic page</Dialog.Title>
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

export interface PageFormDialogProps {
  children: React.ReactNode;
  onSubmit: (data: z.infer<typeof pageSchema>) => void;
  defaultValues: Partial<PageData>;
}
