const { merge } = require('webpack-merge');

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
            return Object.assign({}, entry, { 'process.worker': path.resolve(process.cwd(), 'server/workers/process.worker.ts') })
          })
        }
      });
    } else {
      return config;
    }
  }
};

export default config;
