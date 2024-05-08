import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const commonjs = fromRollup(rollupCommonjs);

export default {
  plugins: [
    commonjs({
      include: [
        // the commonjs plugin is slow, list the required packages explicitly:
        '**/node_modules/url/**/*',
        '**/node_modules/earcut/**/*',
        '**/node_modules/eventemitter3/**/*',
        '**/node_modules/parse-svg-path/**/*',
        '**/node_modules/@xmldom/**/*',
        '**/node_modules/denque/**/*',
        '**/node_modules/chroma-js/**/*',
      ],
    }),
  ],
};
