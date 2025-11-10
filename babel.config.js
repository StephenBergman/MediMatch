module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],

    plugins: [
      "./utils/ErrorHandling/BabelPlugins/guard-origin.ts",

      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          alias: {
            "@": "./",
            app: "./app",
            assets: "./assets",
            components: "./components",
            constants: "./constants",
            hooks: "./hooks",
            utils: "./utils",
            scripts: "./scripts",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
