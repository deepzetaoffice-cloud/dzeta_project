import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

// eslint-config-next registers jsx-a11y but turns on only 6 of its recommended rules. The lint gate
// needs the full set (docs/ai/03). Taking the plugin from Next's config avoids registering it twice.
const nextBase = nextVitals.find((config) => config.plugins?.['jsx-a11y']);
if (!nextBase) throw new Error('eslint-config-next no longer registers jsx-a11y: update eslint.config.mjs.');
const jsxA11y = nextBase.plugins['jsx-a11y'];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    name: 'deepzeta/jsx-a11y-recommended',
    files: nextBase.files,
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    '.lighthouseci/**',
    '.scratch/**',
    // Other sessions' git worktrees: each is a full checkout with its own build output
    '.claude/worktrees/**',
    'docs/**',
    'Planning Folder/**',
    'Mockups fo reference only/**',
  ]),
]);
