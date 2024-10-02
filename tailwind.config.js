import typographyPlugin from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,md,njk}"],
  corePlugins: {
    container: false,
  },
  theme: {
    colors: {
      black: "#000000",
      red: "#e12855",
    },
    container: {
      center: true,
    },
    fontFamily: {
      sans: [
        ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
        { fontVariationSettings: '"wdth" 100' },
      ],
      serif: [
        ['"Noto Serif"', ...defaultTheme.fontFamily.serif],
        { fontVariationSettings: '"wdth" 100' },
      ],
    },
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.black"),
            "--tw-prose-headings": theme("colors.black"),
            "--tw-prose-lead": theme("colors.black"),
            "--tw-prose-links": theme("colors.black"),
            "--tw-prose-bold": theme("colors.black"),
            "--tw-prose-counters": theme("colors.black"),
            "--tw-prose-bullets": theme("colors.black"),
            "--tw-prose-hr": theme("colors.black"),
            "--tw-prose-quotes": theme("colors.black"),
            "--tw-prose-quote-borders": theme("colors.black"),
            "--tw-prose-captions": theme("colors.black"),
            "--tw-prose-code": theme("colors.black"),
            "--tw-prose-pre-code": theme("colors.black"),
            "--tw-prose-pre-bg": theme("colors.black"),
            "--tw-prose-th-borders": theme("colors.black"),
            "--tw-prose-td-borders": theme("colors.black"),
          },
        },
      }),
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addComponents, theme }) => {
      addComponents({
        ".container": Object.assign(
          {
            width: "100%",
            paddingRight: theme("spacing.4"),
            paddingLeft: theme("spacing.4"),
          },
          theme("container.center", false)
            ? { marginRight: "auto", marginLeft: "auto" }
            : {},
          {
            [`@media (min-width: ${theme("screens.sm")})`]: {
              maxWidth: "48rem",
            },
            [`@media (min-width: ${theme("screens.md")})`]: {
              maxWidth: "54rem",
            },
          },
        ),
      });
    }),
  ],
};
