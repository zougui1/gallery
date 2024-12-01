import { furaffinity } from '../furaffinity';
import { DB } from '../database';
import { Source } from '@zougui/gallery.enums';

export const scrapeFuraffinity = async () => {
  console.log('scrapeFuraffinity');

  const { submissions } = await furaffinity.search('');
  const [latestSubmission] = submissions;

  const cursor = await DB.cursor.findOne({ source: Source.furaffinity });
  const nextId = cursor ? cursor.increment + 1 : 1;

  if (nextId > latestSubmission.id) {
    console.log('ignore')
    return;
  }

  console.log('download:', nextId);

  await DB.cursor.updateOne(
    { source: Source.furaffinity },
    { $set: { source: Source.furaffinity, increment: nextId } },
    { upsert: true },
  );
}
