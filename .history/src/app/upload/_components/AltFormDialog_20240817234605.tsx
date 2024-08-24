import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Form } from '@zougui/react.ui';
import { api } from '~/trpc/react';

const altSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().min(1),
  keywords: z.array(z.string().min(1)).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  attachmentUrl: z.string().url().optional(),
});

export const AltFormDialog = ({ children, onSubmit }: AltFormDialogProps) => {
  const form = useForm<z.infer<typeof altSchema>>({
    resolver: zodResolver(altSchema),
    defaultValues: {
      label: '',
      url: '',
      keywords: [],
      title: '',
      description: '',
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
              <Dialog.Title>Alt</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <fieldset className="space-y-4">
                <Form.Input
                  control={form.control}
                  name="url"
                  label="URL"
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

export interface AltFormDialogProps {
  children: React.ReactNode;
  onSubmit: (data: z.infer<typeof altSchema>) => void;
}
