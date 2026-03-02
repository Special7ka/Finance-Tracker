/** @type {import('vitest/config').UserConfig} */
module.exports = {
  test: {
    environment: "node",
    globals: true,
    include: ["__tests__/**/*.test.(js|ts)"],
    setupFiles: ["__tests__/setup.ts"],
    testTimeout: 20000
  }
};