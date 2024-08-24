import Link from 'next/link';

import { LatestPost } from '~/app/_components/post';
import { api, HydrateClient } from '~/trpc/server';

export default async function Home() {
  const hello = await api.postQueue.find();

  const handleClick = () => {
    console.log('test')
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <button onClick={handleClick}>create</button>
      </main>
    </HydrateClient>
  );
}
