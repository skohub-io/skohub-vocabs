module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: ["react-app", "plugin:cypress/recommended"],
  rules: {
    "node/no-path-concat": "off",
    "react-hooks/rules-of-hooks": "off",
    "no-console": "error",
    "testing-library/await-async-queries": "error",
    "testing-library/no-await-sync-queries": "error",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-dom-import": "off",
  },
  plugins: ["testing-library"],
  overrides: [
    {
      files: ["**/cypress/**/*.cy.js"],
      rules: {
        "testing-library/await-async-queries": 0,
      },
    },
  ],
}
