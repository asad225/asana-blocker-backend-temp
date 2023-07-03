import type { Configuration } from 'webpack';

module.exports = {
  entry: { background: 'src/background.js', contentScipt: 'src/contentScript.js' },
} as Configuration;