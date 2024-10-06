'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button, Dialog, Typography, type DialogRootProps, Separator, IconButton, Input } from '@zougui/react.ui';

import { PostThumbnail } from '~/app/_components/organisms/PostThumbnail';
import { AltTable } from '~/app/upload/_components/AltTable';
import { api } from '~/trpc/react';
import { type SubmissionUploadSchema } from '~/schemas/upload';
import { type PostSchemaWithId } from '~/server/database';
import { PostSelectorDialog } from '~/app/_components/organisms/PostSelectorDialog';

const AltGallery = ({ id }: { id: string }) => {
  const [currentAlts] = api.post.findByAltId.useSuspenseQuery({ id });

  return (
    <div className="flex justify-center gap-4 flex-wrap">
      {!currentAlts.length && (
        <Typography.Paragraph>No alts</Typography.Paragraph>
      )}

      {currentAlts.map(alt => (
        <PostThumbnail.Root key={alt._id} post={alt}>
          <PostThumbnail.Image />
          <PostThumbnail.Title>{alt.alt?.label}</PostThumbnail.Title>
        </PostThumbnail.Root>
      ))}
    </div>
  );
}

export const AddAltsFormDialog = ({
  post,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onOpenChange,
  ...rest
}: AddAltsFormDialogProps) => {
  const [newAlts, setNewAlts] = useState<Omit<SubmissionUploadSchema['asAlt'], 'createdAt'>[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<PostSchemaWithId[]>([]);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Partial<Record<string, string | null>>>({});

  const utils = api.useUtils();
  const router = useRouter();

  const creationMutation = api.postQueue.create.useMutation({
    onSuccess: async () => {
      router.refresh();
      await Promise.allSettled([
        utils.postQueue.invalidate(),
        await utils.post.invalidate(),
      ]);
    },
  });

  const addAlts = () => {
    onOpenChange?.(false);

    const altId = post.alt?.id ?? nanoid();
    const now = Date.now();

    const associatedPosts = (selectedPosts ?? []).map(selectedPost => {
      return {
        sourceUrl: selectedPost.sourceUrl,
        alt: {
          id: altId,
          label: labels[selectedPost._id],
        },
        series: post.series,
      };
    });

    if (!post.alt) {
      associatedPosts.push({
        sourceUrl: post.sourceUrl,
        alt: {
          id: altId,
          label: 'Original',
        },
        series: post.series,
      });
    }

    creationMutation.mutate({
      newPosts: newAlts.map((alt, index) => {
        return {
          ...alt,
          series: post.series,
          createdAt: new Date(now + index),
          alt: {
            id: altId,
            label: alt.alt.label,
          },
        };
      }),
      associatedPosts,
    });

    setNewAlts([]);
    setSelectedPosts([]);
    setErrors({});
    setLabels({});
  }

  const handleLabelChange = (postId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setLabels(prevLabels => {
      return {
        ...prevLabels,
        [postId]: value,
      };
    });

    setErrors(prevErrors => {
      if (prevErrors[postId] === undefined) {
        return prevErrors;
      }

      return {
        ...prevErrors,
        [postId]: value.trim() ? null : 'Required',
      };
    });
  }

  const handleSubmit = () => {
    const labelErrors: Record<string, string> = {};

    for (const post of selectedPosts) {
      if (!labels[post._id]?.trim()) {
        labelErrors[post._id] = 'Required';
      }
    }

    if (Object.keys(labelErrors).length) {
      return setErrors(labelErrors);
    }

    addAlts();
  }

  return (
    <Dialog.Root {...rest} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-5xl">
        <Dialog.Header>
          <Dialog.Title>Add alts</Dialog.Title>
          <Dialog.Description>Add alts to the current post</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="space-y-4">
          <Typography.H4>New alts</Typography.H4>

          <div>
            <Typography.H5>Uploads</Typography.H5>

            <AltTable
              alts={newAlts}
              defaultValue={{
                keywords: post.keywords,
              }}
              onAltsChange={setNewAlts}
            />
          </div>

          <div>
            <Typography.H5>Posts</Typography.H5>

            <div className="w-full flex gap-4 flex-wrap">
              {selectedPosts.map(selectedPost => (
                <PostThumbnail.Root key={selectedPost._id} post={selectedPost}>
                  <PostThumbnail.Image />
                  <PostThumbnail.Title />

                  <div className="flex flex-col">
                    <Input
                      placeholder="Label"
                      value={labels[selectedPost._id] ?? ''}
                      onChange={handleLabelChange(selectedPost._id)}
                    />

                    {errors[selectedPost._id] && (
                      <p className="text-destructive text-sm font-medium">{errors[selectedPost._id]}</p>
                    )}
                  </div>
                </PostThumbnail.Root>
              ))}

              <div className="h-48 w-16 flex justify-center items-center">
                <PostSelectorDialog
                  key={selectedPosts.map(p => p._id).join(',')}
                  defaultSelectedPosts={selectedPosts}
                  onSelectPosts={setSelectedPosts}
                  excludeAlts
                  multiple
                >
                  <PostSelectorDialog.Trigger asChild>
                    <IconButton size="lg" className="w-6 h-6">
                      <Plus className="w-6 h-6" />
                    </IconButton>
                  </PostSelectorDialog.Trigger>
                </PostSelectorDialog>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Typography.H4 className="pb-2">Current alts</Typography.H4>
            {post.alt && <AltGallery id={post.alt.id} />}
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>

          <Button onClick={handleSubmit}>Add new alts</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export interface AddAltsFormDialogProps extends DialogRootProps {
  post: PostSchemaWithId;
}
