/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {


    if (isServer) {
      return merge(config, {
        entry () {
          return config.entry().then((entry) => {
            return Object.assign({}, entry, { 'collection.worker': path.resolve(process.cwd(), 'workers/collection.worker.ts') })
          })
        }
      });
    } else {
      return config;
    }
  }
};

export default config;
