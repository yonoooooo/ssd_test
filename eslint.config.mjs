import globals from "globals";
import pluginJs from "@eslint/js";
import pluginSecurity from "eslint-plugin-security";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["tests/**/*.js", "tests/**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: "readonly",   // Mocha globals
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly"
      }
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      security: pluginSecurity
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "security/detect-eval-with-expression": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error"
    }
  },
  // Browser-specific config
  {
    files: ["src/public/**/*.js"],
    languageOptions: {
      globals: globals.browser
    }
  },
  // Node.js-specific config  
  {
    files: ["src/server.js", "src/utils/**/*.js"],
    languageOptions: {
      globals: globals.node
    }
  }
];