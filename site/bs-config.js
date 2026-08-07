/**
 * lite-server / browser-sync config.
 *
 * Default lite-server enables historyApiFallback, which rewrites bare paths like
 * `/directory` (no trailing slash) to `/index.html` — the homepage. Disable that
 * so folder indexes under /directory/ work as real static pages.
 */
module.exports = {
  port: 3002,
  open: false,
  files: ["./**/*.{html,htm,css,js,json}"],
  server: {
    baseDir: "./",
    middleware: {
      // lite-server default stack: 0 = CORS log, 1 = historyApiFallback, 2 = ...
      1: null,
    },
  },
};
