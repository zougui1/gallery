'use client';

import { nanoid } from 'nanoid';

import { Button, Dialog, Form } from '@zougui/react.ui';

import { api } from '~/trpc/react';
import { submissionUploadSchema, type SubmissionUploadSchema } from '~/schemas/upload';
import { useAppForm } from '~/app/_hooks';

export const AltFormDialog = ({ children, onSubmit, defaultValue }: AltFormDialogProps) => {
  const form = useAppForm({
    schema: submissionUploadSchema.asAlt.omit({ createdAt: true }),
    defaultValues: {
      alt: {
        id: defaultValue?.alt?.id ?? nanoid(),
        label: defaultValue?.alt?.label ?? '',
      },
      url: defaultValue?.url ?? '',
      keywords: defaultValue?.keywords ?? [],
      title: defaultValue?.title ?? '',
      description: defaultValue?.description ?? '',
      attachmentUrl: defaultValue?.attachmentUrl ?? '',
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);
  const { data: keywords } = api.post.findAllKeywords.useQuery();

  return (
    <Dialog.Root>
      {children}

      <Dialog.Content className="max-w-4xl">
        <Form.Root {...form}>
          <form>
            <Dialog.Header>
              <Dialog.Title>Alt</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <fieldset className="space-y-6">
                <Form.Input
                  control={form.control}
                  name="alt.label"
                  label="Label"
                />

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
                  {keywords?.map(keyword => (
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

AltFormDialog.Trigger = Dialog.Trigger;

export interface AltFormDialogProps {
  children?: React.ReactNode;
  onSubmit: (data: Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>) => void;
  defaultValue?: Partial<SubmissionUploadSchema['asAny']>;
}
