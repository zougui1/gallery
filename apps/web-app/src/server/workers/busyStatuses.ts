import { PostQueueStatus } from '~/enums';

export const busyStatuses: PostQueueStatus[] = [
  PostQueueStatus.fetchingData,
  PostQueueStatus.downloadingContent,
  PostQueueStatus.processing,
  PostQueueStatus.checkingDuplicates,
  PostQueueStatus.deleting,
];
