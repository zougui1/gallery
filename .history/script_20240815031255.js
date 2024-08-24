import axios from 'axios';

const ids = [
  57630905,
  57650527,
  57744954,
  57744935,
  57744722,
  57744662,
  57743806,
  57743599,
  57743630,
  57743297,
  57743296,
  57743200,
  57745005,
  57733512,
  57752679,
  57752322,
];

const uploadSubmission = async (id) => {
  await axios.post(`http://localhost:3000/api/trpc/postQueue.create?batch=1`, {
    '0': {
      json: {
        createdAt: new Date(),
        keywords: [],
        url: `https://www.furaffinity.net/view/${id}`,
      },
      meta: {
        values: {
          createdAt: ['Date']
        }
      }
    }
  });
};

const trackedUploadSubmission = async (id) => {
  console.group('submission:', id)

  try {
    console.log('uploading...');
    await uploadSubmission(id);
    console.log('uploaded');
  } catch (error) {
    console.log('error:', error.message);
  }

  console.groupEnd()
}

(async () => {
  for (const id of ids) {
    await trackedUploadSubmission(id);
  }

  for (let index = 200; index < 1000; index++) {
    await trackedUploadSubmission(index);
  }

  console.log('done');
})().catch(error => console.error(error));
