'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

import { Button, Form, Typography } from '@zougui/react.ui';

import { api } from '~/trpc/react';

import { type ChapterData, ChapterTable } from './ChapterTable';
import { nanoid } from 'nanoid';
import { PostSeriesType } from '~/enums';

const formSchema = z.object({
  name: z.string().min(1),
  commonKeywords: z.array(z.string().min(1)),
});

export const ComicSubmissionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      commonKeywords: [],
    },
  });

  const [chapters, setChapters] = useState<ChapterData[]>([]);

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
    const seriesId = nanoid();

    const pages = chapters.flatMap((chapter) => {
      const chapterPages = chapter.pages.flatMap(chapterPage => {
        const altId = nanoid();

        return [chapterPage, ...chapterPage.alts].map((submission, index) => {
          return {
            ...chapterPage,
            createdAt: new Date(now + (chapter.chapterIndex * 1000) + (chapterPage.series.partIndex * 10) + index),
            series: {
              ...chapterPage.series,
              type: PostSeriesType.comic,
              name: data.name,
              chapterName: chapterPage.title,
              chapterIndex: chapter.chapterIndex,
              id: seriesId,
            },
            alt: {
              id: altId,
              label: ('alt' in submission && submission.alt?.label) || 'Original',
            },
          };
        });
      });

      return chapterPages;
    });

    creationMutation.mutate(pages);

    form.reset();
    setChapters([]);
  });

  return (
    <Form.Root {...form}>
      <div className="space-y-8">
        <form className="w-1/2 flex flex-col gap-6">
          <Form.Input
            control={form.control}
            name="name"
            label="Comic name"
          />

          <Form.Autocomplete.Root
            control={form.control}
            name="commonKeywords"
            label="Common keywords"
            multiple
            creatable
          >
            {keywords.map(keyword => (
              <Form.Autocomplete.Item key={keyword} value={keyword}>
                {keyword}
              </Form.Autocomplete.Item>
            ))}
          </Form.Autocomplete.Root>
        </form>

        <div>
          <Typography.H4 className="text-center">Chapters</Typography.H4>

          <ChapterTable
            chapters={chapters}
            onChaptersChange={setChapters}
            defaultValues={{
              chapterIndex: chapters.length + 1,
              keywords: form.watch('commonKeywords'),
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
