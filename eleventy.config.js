import { EleventyI18nPlugin } from "@11ty/eleventy";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import paths from "./src/_data/paths.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "fi",
  });

  eleventyConfig.addFilter(
    "makePath",
    /** @param {string} value, @param {string} lang  */ function (value, lang) {
      return `${paths[lang][value]}index.html`;
    },
  );

  eleventyConfig.addWatchTarget("./tailwind.config.js");

  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: function (contents, inputPath) {
      return async function () {
        return (
          await postcss([
            tailwindcss,
            autoprefixer,
            ...(process.env.NODE_ENV === "production" ? [cssnano] : []),
          ]).process(contents, {
            from: inputPath,
          })
        ).css;
      };
    },
    compileOptions: {
      permalink: function (_, inputPath) {
        return inputPath.substring(inputPath.lastIndexOf("/") + 1);
      },
    },
  });
}

export const config = {
  dir: {
    input: "src",
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
};
