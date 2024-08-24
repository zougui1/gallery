const uploadSubmission = async (id) => {
  await fetch({
    method: 'POST',
    url: `http://localhost:3000/api/trpc/postQueue.create?batch=1`,
    body: JSON.stringify([
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
    ]),
  });

(async () => {
  await uploadSubmission(1);

  console.log('done');
})();
