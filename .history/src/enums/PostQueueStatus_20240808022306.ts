export enum PostQueueStatus {
  idle = 'idle',
  /**
   * fetching a submission's metadata (title, description, keywords, etc...)
   */
  fetchingData = 'fetchingData',
  /**
   * downloading a submission's files (thumbnail, art/video/story/etc...)
   */
  downloadingContent = 'downloadingContent',
  /**
   * processing a submission's thumbnail and content file
   */
  processing = 'processing',
  /**
   * scanning the database for similar posts
   */
  scanning = 'scanning',
  /**
   * submission's process pipeline complete and ready to be visualized in the gallery
   */
  complete = 'complete',
  error = 'error',
  /**
   * deleting the submission's files
   */
  deleting = 'deleting',
  /**
   * submission files deleted from the drive and post document deleted from collection
   */
  deleted = 'deleted',
}
