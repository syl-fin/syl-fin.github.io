import { EleventyI18nPlugin } from "@11ty/eleventy";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import htmlmin from "html-minifier-terser";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import paths from "./src/_data/paths.js";

async function createFileHash(inputPath) {
  try {
    const data = fs.readFileSync(inputPath, "utf-8");
    const processed = (
      await postcss([
        tailwindcss,
        autoprefixer,
        ...(process.env.NODE_ENV === "production" ? [cssnano] : []),
      ]).process(data, {
        from: inputPath,
      })
    ).css;
    const hash = crypto.createHash("sha256").update(processed).digest("hex");
    return hash;
  } catch (err) {
    console.error(err);
  }
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    defaultLanguage: "fi",
  });

  eleventyConfig.addFilter(
    "tUrl",
    /** @param {string} value, @param {string?} lang */ function (value, lang) {
      console.log(
        "The translation was called with the value",
        value,
        "and language",
        lang,
      );
      if (lang === this.page.lang) {
        return value;
      }
      const locale = lang ? lang : this.page.lang;
      console.log("The language was set to", locale);
      if (value in paths[locale]) {
        return `${paths[locale][value]}`;
      }
      throw new ReferenceError(
        `Trying to translate the path ${value} to the locale ${locale} but no valid translation was found.`,
      );
    },
  );
  eleventyConfig.addFilter(
    "makePath",
    /** @param {string} value, @param {string} lang  */ function (value, lang) {
      return `${paths[lang][value]}index.html`;
    },
  );
  eleventyConfig.addFilter(
    "hash",
    /** @param {string} filename */ async function (filename) {
      const inputFile = path.join("src", filename);
      console.log("The file to be hashed via the filter is", inputFile);
      const hash = await createFileHash(inputFile);
      console.log(
        "Going to write the filename",
        `${filename.substring(0, filename.lastIndexOf("."))}.${hash}.css`,
      );
      return `${filename.substring(0, filename.lastIndexOf("."))}.${hash}.css`;
    },
  );

  eleventyConfig.addTransform("htmlmin", function (content) {
    if (
      process.env.ELEVENTY_RUN_MODE === "build" &&
      (this.page.outputPath || "").endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.addPassthroughCopy({ "src/*.ico": "/" });
  eleventyConfig.addPassthroughCopy({ "src/*.png": "/" });
  eleventyConfig.addPassthroughCopy({ "src/*.svg": "/" });

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
      permalink: async function (_, inputPath) {
        const filename = inputPath.substring(
          inputPath.lastIndexOf("/") + 1,
          inputPath.lastIndexOf("."),
        );
        const hash = await createFileHash(inputPath);
        return `${filename}.${hash}.css`;
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
