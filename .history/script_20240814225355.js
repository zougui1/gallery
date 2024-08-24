import axios from 'axios';

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
  /*const d = {
    "0": {
      "json": {
        "url": "https://www.furaffinity.net/view/57752322/",
        "keywords": [],
        "createdAt": "2024-08-14T20:38:39.976Z"
      },
      "meta": {
        "values": {
          "createdAt": ["Date"]
        }
      }
    }
  }*/
};

(async () => {
  for (let index = 0; index < 200; index++) {
    console.log(`Uploading submission ${index}...`)
    await uploadSubmission(index);
  }

  console.log('done');
})().catch(error => console.error(error.message));
