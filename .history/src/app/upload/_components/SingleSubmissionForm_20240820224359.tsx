'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Form, Typography } from '@zougui/react.ui';

import { submissionUploadSchema } from '~/schemas/upload';
import { api } from '~/trpc/react';
import { type AltData, AltTable } from './AltTable';
import { useState } from 'react';
import { nanoid } from 'nanoid';

export const SingleSubmissionForm = () => {
  const form = useForm<z.infer<typeof submissionUploadSchema.asEither>>({
    resolver: zodResolver(submissionUploadSchema.asEither),
    defaultValues: {
      description: '',
      keywords: [],
      title: '',
      url: '',
      attachmentUrl: '',
    },
  });

  const [alts, setAlts] = useState<z.infer<typeof submissionUploadSchema.asEither>[]>([]);
  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();
  const utils = api.useUtils();

  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    const now = Date.now();

    creationMutation.mutate([data, ...alts].map((submission, index) => ({
      ...submission,
      createdAt: new Date(now + index),
    })));

    form.reset();
    setAlts([]);
  });

  return (
    <Form.Root {...form}>
      <div className="space-y-8">
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

          {alts.length > 0 && (
            <Form.Input
              control={form.control}
              name="alt.label"
              label="Alt label"
            />
          )}
        </form>

        <div>
          <Typography.H4 className="text-center">Alts</Typography.H4>

          <AltTable
            alts={alts}
            onAltsChange={setAlts}
            originalData={form.watch()}
          />
        </div>


        {creationMutation.error && (
          <Typography.Paragraph className="text-destructive">{creationMutation.error.message}</Typography.Paragraph>
        )}

        {creationMutation.isPending && (
          <Typography.Paragraph>Uploading...</Typography.Paragraph>
        )}
        <div className="h-auto flex justify-end gap-6">
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
      </div>
    </Form.Root>
  );
}
