module.exports = {
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime'],
  testPathIgnorePatterns: ['node_modules', '.cache'],
  transform: {
    "^.+\\.jsx?$": "<rootDir>/jest-preprocess.js"
  }
}