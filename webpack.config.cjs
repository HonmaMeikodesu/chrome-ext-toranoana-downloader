const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
        fallback: { stream: require.resolve("stream-browserify") },
        extensionAlias: {
            '.js': ['.ts', '.js'],
            '.jsx': ['.tsx', '.jsx']
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        /** @type {import("@babel/core").TransformOptions} */
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-react"
                            ],
                            plugins: [
                                ["import", { libraryName: "antd", style: true, libraryDirectory: "lib" }],
                                ["import", { libraryName: "lodash", camel2DashComponentName: false, libraryDirectory: "" }, "import-lodash"]
                            ]

                        }
                    },
                    {
                        loader: "ts-loader",
                        /** @type {import("ts-loader").Options} */
                        options: {
                            logInfoToStdOut: true,
                            logLevel: "INFO",
                        }

                    }
                ],
                exclude: /node_modules/,
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
    plugins: [
        new HtmlWebpackPlugin({
            excludeChunks: ["content"]
        }),
        process.env.ANALYZE_FLAG ? new BundleAnalyzerPlugin({ analyzerPort: 9000}) : undefined
    ].filter(Boolean),
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
        },
        extensionAlias: {
            '.js': ['.ts', '.js']
        },
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env"
                            ],
                            plugins: [
                                ["import", { libraryName: "lodash", camel2DashComponentName: false, libraryDirectory: "" }, "import-lodash"]
                            ]
                        }
                    },
                    {
                        loader: "ts-loader"
                    }
                ],
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        process.env.ANALYZE_FLAG ? new BundleAnalyzerPlugin({ analyzerPort: 9001}) : undefined
    ].filter(Boolean),
    devtool: false,
};

exports.default = [ webConfig, serviceWorkerConfig ];
