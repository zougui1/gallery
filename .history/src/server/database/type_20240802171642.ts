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
  // optional as direct uploads don't have a URL
  // normalize the URL (remove prefix x/fx/vx)
  url?: string;
  title: string;
  contentType: ContentType;
  description?: string;
  keywoards: string[];
  // optional as direct uploads don't have an author
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
  // optional as direct uploads don't have "original" data
  original?: {
    source: Source;
    // TODO same as the type 'Submission' from the package furaffinity
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
