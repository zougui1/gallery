import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Dialog, Form } from '@zougui/react.ui';

import { type PageData } from './PageTable';

const pageSchema = z.object({
  title: z.string().optional(),
  partIndex: z.number().min(1).int(),
  pages: z.array(z.object({})),
});

export const PageFormDialog = ({ children, onSubmit, defaultValues }: PageFormDialogProps) => {
  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: defaultValues.title ?? '',
      partIndex: defaultValues.partIndex ?? 1,
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
              <Dialog.Title>Comic page</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <fieldset className="space-y-6">
                <Form.Input
                  control={form.control}
                  name="partIndex"
                  label="Page"
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

export interface PageFormDialogProps {
  children: React.ReactNode;
  onSubmit: (data: z.infer<typeof pageSchema>) => void;
  defaultValues: Partial<PageData>;
}
