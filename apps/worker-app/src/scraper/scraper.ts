import { scrapeFuraffinity } from './scrapeFuraffinity';

export const scraper = async () => {
  let running = true;

  const onShutdown = () => {
    running = false;
  }

  process.on('SIGINT', onShutdown)
  process.on('SIGTERM', onShutdown)

  while (running) {
    await scrapeFuraffinity();
    await new Promise(r => setTimeout(r, 2000));
  }
}
