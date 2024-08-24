'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';

import { Button, Form, Typography } from '@zougui/react.ui';

import { submissionUploadSchema, type SubmissionUploadSchema } from '~/schemas/upload';
import { api } from '~/trpc/react';
import { useAppForm } from '~/app/_hooks';

import { AltTable } from './AltTable';

export const SingleSubmissionForm = () => {
  const form = useAppForm({
    schema: submissionUploadSchema.asAny.omit({ createdAt: true }),
    defaultValues: {
      description: '',
      keywords: [],
      title: '',
      url: '',
      attachmentUrl: '',
      alt: {
        id: nanoid(),
        label: 'Original',
      },
    },
  });

  const [alts, setAlts] = useState<Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>[]>([]);
  const { data: keywords } = api.post.findAllKeywords.useQuery();
  const utils = api.useUtils();

  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    const now = Date.now();
    const altId = nanoid();

    creationMutation.mutate([data, ...alts].map((submission, index) => ({
      ...submission,
      createdAt: new Date(now + index),
      alt: {
        id: altId,
        label: submission.alt?.label ?? 'Original',
      },
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
            defaultValue={{
              ...form.watch(),
              alt: undefined,
              url: undefined,
            }}
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
