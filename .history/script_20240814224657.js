import axios from 'axios';

const uploadSubmission = async (id) => {
  await axios.post(`http://localhost:3000/api/trpc/postQueue.create?batch=1`,
    {
      '0':
      {
      json: {
        createdAt: new Date(),
        keywords: [],
        url: `https://www.furaffinity.net/view/${id}`,
      },
      meta: {
        values: {
          createdAt: 'Date'
        }
      }
    },
    },
  );
};

(async () => {
  await uploadSubmission(1);

  console.log('done');
})();
