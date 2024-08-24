'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button, Form, Typography } from '@zougui/react.ui';

import { furaffinityUrlUploadSchema, unknownUrlUploadSchema } from '~/schemas/upload';
import { api } from '~/trpc/react';
import { type AltData } from './AltTable';
import { SeriesTable } from './SeriesTable';
import { useState } from 'react';

const baseStoryShape = {
  altLabel: z.string().optional(),
};

const storySchema = z.union([
  furaffinityUrlUploadSchema.omit({ createdAt: true }).extend(baseStoryShape),
  unknownUrlUploadSchema.omit({ createdAt: true }).extend(baseStoryShape),
]);

const formSchema = z.object({
  name: z.string().min(1),
  commonKeywords: z.array(z.string().min(1)),
});

export const StorySubmissionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      commonKeywords: [],
    },
  });

  const [series, setSeries] = useState<AltData[]>([]);

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

    /*creationMutation.mutate([data, ...series].map(alt => ({
      ...alt,
      createdAt,
    })));*/

    form.reset();
    setSeries([]);
  });

  return (
    <Form.Root {...form}>
      <div className="space-y-8">
        <form className="w-1/2 flex flex-col gap-6">
          <Form.Input
            control={form.control}
            name="name"
            label="Series name"
          />
        </form>

        <div>
          <Typography.H4 className="text-center">Series</Typography.H4>

          <SeriesTable
            series={series}
            onSeriesChange={setSeries}
            partLabel="Part"
            //originalData={form.watch()}
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
