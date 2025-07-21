module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [ // Add this plugin array
    ["module:react-native-dotenv", {
      "moduleName": "@env",
      "path": ".env",
    }]
  ]
};