module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: ["react-app", "plugin:cypress/recommended"],
  rules: {
    "node/no-path-concat": "off",
    "react-hooks/rules-of-hooks": "off",
    "no-console": "error",
  },
}
