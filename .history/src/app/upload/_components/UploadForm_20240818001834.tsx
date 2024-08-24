'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Form, Typography } from '@zougui/react.ui';

import { furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';
import { api } from '~/trpc/react';
import { type AltData, AltTable } from './AltTable';
import { useState } from 'react';

const baseFormShape = {
  altLabel: z.string().optional(),
};

const formSchema = z.union([
  furaffinityUrlUploadSchema.omit({ createdAt: true }).extend(baseFormShape),
  unknownUrlUploadSchema.omit({ createdAt: true }).extend(baseFormShape),
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
      altLabel: '',
    },
  });

  const [alts, setAlts] = useState<AltData[]>([
    {
      label: 'cum',
      url: 'https://www.furaffinity.net/view/15114441',
      keywords: ['dragon', 'cum', 'bondage', 'rough', 'sex', 'dick', 'pussy', 'straight', 'dom', 'sub', 'pet', 'master', 'pet-play', 'cum'],
      title: 'Teaching my pet how to be a good girl - cum alt',
      attachmentUrl: 'https://www.furaffinity.net/view/445414544'
    },
    {
      label: 'internal',
      url: 'https://www.furaffinity.net/view/15114442',
      keywords: ['dragon', 'cum', 'bondage', 'rough', 'sex', 'dick', 'pussy', 'straight', 'dom', 'sub', 'pet', 'master', 'pet-play', 'internal'],
      title: 'Teaching my pet how to be a good girl - internal alt',
      attachmentUrl: 'https://www.furaffinity.net/view/445414544'
    },
    {
      label: 'cum + internal',
      url: 'https://www.furaffinity.net/view/15114442',
      keywords: ['dragon', 'cum', 'bondage', 'rough', 'sex', 'dick', 'pussy', 'straight', 'dom', 'sub', 'pet', 'master', 'pet-play', 'cum', 'internal'],
      title: 'Teaching my pet how to be a good girl - cum & internal alt',
      attachmentUrl: 'https://www.furaffinity.net/view/445414544'
    },
  ]);

  const [keywords] = api.post.findAllKeywords.useSuspenseQuery();
  const utils = api.useUtils();

  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      await utils.postQueue.invalidate();
      await utils.post.invalidate();
    },
  });

  const handleSubmit = form.handleSubmit(data => {
    const createdAt = new Date();

    creationMutation.mutate([data, ...alts].map(alt => ({
      ...alt,
      createdAt,
    })));
  });

  console.log(form.formState.errors)

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
              name="altLabel"
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
        <div className="flex justify-end gap-6 bg-background">
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
