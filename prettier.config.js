/** @type {import("prettier").Config} */
const config = {
  plugins: [
    "prettier-plugin-packagejson",
    "prettier-plugin-organize-imports",
    "prettier-plugin-jinja-template",
    "prettier-plugin-tailwindcss",
  ],
  arrowParens: "always",
  bracketSpacing: true,
  printWidth: 80,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  proseWrap: "always",
  overrides: [
    {
      files: ["*.njk"],
      options: {
        parser: "jinja-template",
      },
    },
  ],
};

export default config;
