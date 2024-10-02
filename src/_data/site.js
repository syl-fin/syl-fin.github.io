export default {
  url:
    process.env.ELEVENTY_RUN_MODE === "build"
      ? "https://vaalikone.syl.fi"
      : "http://localhost:8080",
};
