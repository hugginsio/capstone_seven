/**
 * Custom angular webpack configuration
 */

module.exports = (config, options) => {
  config.target = "electron-renderer";

  if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== "src/environments/environment.ts") {
        continue;
      }

      let fileReplacementParts = fileReplacement["with"].split(".");
      if (fileReplacementParts.length > 1 && ["web"].indexOf(fileReplacementParts[1]) >= 0) {
        config.target = "web";
      }

      break;
    }
  }

  return config;
};

const merge = require("webpack-merge");

module.exports = (config) => {
  const isProd = config.mode === "production";
  const tailwindConfig = require("./tailwind.config.js")(isProd);

  return merge(config, {
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              ident: "postcss",
              syntax: "postcss-scss",
              plugins: [require("postcss-import"), require("tailwindcss")(tailwindConfig), require("autoprefixer")],
            },
          },
        },
      ],
    },
  });
};
