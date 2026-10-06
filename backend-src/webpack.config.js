const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./server.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js",
    clean: true,
  },
  devtool: false,
  externalsPresets: {
    node: true,
  },
  externals: {
    bcryptjs: "commonjs bcryptjs",
    cors: "commonjs cors",
    dotenv: "commonjs dotenv",
    express: "commonjs express",
    mongoose: "commonjs mongoose",
  },
  resolve: {
    extensions: [".js"],
  },
};
