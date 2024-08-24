'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Form, Typography } from '@zougui/react.ui';

import { fileUploadSchema, furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';
import { api } from '~/trpc/react';

const formSchema = z.union([
  fileUploadSchema.omit({ createdAt: true }),
  furaffinityUrlUploadSchema.omit({ createdAt: true }),
  unknownUrlUploadSchema.omit({ createdAt: true }),
]);

export const UploadForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      keywords: [],
      title: '',
      url: '',
      attachmentUrl: '',
    },
  });

  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();
  const utils = api.useUtils();

  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    creationMutation.mutate({
      ...data,
      createdAt: new Date(),
    });
  });

  return (
    <Form.Root {...form}>
      <form className="w-1/2 flex flex-col gap-6">
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

        <div className="flex gap-6">
          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={creationMutation.isPending}
          >
            Upload
          </Button>

          <Button variant="secondary" disabled={creationMutation.isPending}>
            Cancel
          </Button>
        </div>

        {creationMutation.error && (
          <Typography.Paragraph className="text-destructive">{creationMutation.error.message}</Typography.Paragraph>
        )}

        {creationMutation.isPending && (
          <Typography.Paragraph>Uploading...</Typography.Paragraph>
        )}
      </form>
    </Form.Root>
  );
}
