import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  {
    rules: {
      // .claude/context/coding-standards.md: no console.log left in committed code.
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // .claude/context/coding-standards.md: named exports only, except Next's
      // special files (which require a default export) — see override below.
      "import/no-default-export": "error",
      // CLAUDE.md non-negotiable #3 / frontend.md §11: @supabase/* may be imported
      // ONLY inside src/lib/supabase/** — the rest of the app goes through
      // lib/api/*. This ESLint rule is what makes that seam enforced, not just
      // documented; the src/lib/supabase/** override below re-permits it there.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@supabase/*", "@supabase/**"],
              message:
                "Import @supabase/* only inside src/lib/supabase/**. Everywhere else, call through lib/api/* — see CLAUDE.md non-negotiable #3 and frontend.md §11.",
            },
          ],
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  {
    // Next.js requires a default export from these files — the ban above
    // doesn't apply to them.
    files: [
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/error.tsx",
      "src/app/**/global-error.tsx",
      "src/app/**/not-found.tsx",
      "src/app/**/template.tsx",
      "src/app/**/default.tsx",
      "src/app/**/route.ts",
      "src/app/**/sitemap.ts",
      "src/app/**/robots.ts",
      "src/app/**/manifest.ts",
      "src/app/**/opengraph-image.tsx",
      "src/app/**/twitter-image.tsx",
      "src/app/**/icon.tsx",
      "src/app/**/apple-icon.tsx",
      "src/middleware.ts",
      "next.config.ts",
      "postcss.config.mjs",
      "*.config.{js,mjs,ts}",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    // The one place @supabase/* is allowed to be imported (frontend.md §11).
    // This is the backend-migration seam: when a real backend eventually
    // replaces direct Supabase calls, only these files change.
    files: ["src/lib/supabase/**"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
