const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type {import("webpack").Configuration}  */
const webConfig = {
    target: "web",
    entry: {
        popup: "./src/popup/index.tsx",
        content: "./src/index.ts"
    },
    output: { path: path.resolve(__dirname, "dist") },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        fallback: { stream: require.resolve("stream-browserify") }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                    }
                },
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    devtool: false,
    plugins: [new HtmlWebpackPlugin({
        excludeChunks: ["content"]
    })],
};

/** @type {import("webpack").Configuration}  */
const serviceWorkerConfig = {
    target: "webworker",
    entry: {
        background: "./src/background.ts",
    },
    output: { path: path.resolve(__dirname, "dist") },
    resolve: {
        extensions: [".ts", ".js", ".json"],
        fallback: {
            stream: require.resolve("stream-browserify"),
            "perf_hooks": require.resolve("./WEBPACK_FALLBACK/perf_hooks.cjs"),
            "canvas": require.resolve("./WEBPACK_FALLBACK/canvas-shim.cjs")
        }
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                    }
                },
            }
        ],
    },
    devtool: false,
};

exports.default = [ webConfig, serviceWorkerConfig ];
