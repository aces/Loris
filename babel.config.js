module.exports = function(api) {
  api.cache(true);
  const presets = [
    "@babel/preset-react",
    "@babel/preset-env"
  ];
  const plugins = [
    ["@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ];
  return {
    presets,
    plugins
  };
}
