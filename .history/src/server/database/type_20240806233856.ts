export enum ContentType {
  art = 'art',
  story = 'story',
}

export enum Source {
  furaffinity = 'furaffinity',
  e621 = 'e621',
}

export interface Author {
  name: string;
  url: string;
  avatar?: string;
}

//* collection
export interface Post {
  _id: string;
  sourceUrl: string;
  title: string;
  contentType: ContentType;
  description?: string;
  keywoards: string[];
  author?: Author;
  file: {
    fileName: string;
    contentType: string;
    // only images have a hash
    hash?: string;
  };
  thumbnail: {
    fileName: string;
    contentType: string;
  };
  postedAt: Date;
  createdAt: Date;
  removedAt: Date;
  original?: {
    source: Source;
    // TODO union of the types 'Submission' from the packages furaffinity, e621, etc...
    data: unknown;
  };
}

export enum PostQueueStatus {
  idle = 'idle',
  fetchingData = 'fetchingData',
  downloadingFile = 'downloadingFile',
  processing = 'processing',
  success = 'success',
  error = 'error',
}

// collection
export interface PostQueue {
  steps: {
    status: PostQueueStatus;
    message: string;
    date: Date;
  }[];
  // optional as only direct uploads have a file available at this point
  fileName?: string;
  // optional as direct uploads don't have a URL
  url?: string;
  // optional as only direct uploads have a title
  title?: string;
  keywords?: string[];
  description?: string;
  createdAt: Date;
}
