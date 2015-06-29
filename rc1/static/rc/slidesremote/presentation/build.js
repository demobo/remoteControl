({
    mainConfigFile : "dev/indexRequire.js",

    appDir: "dev",
    baseUrl: "./",
    findNestedDependencies: true,
    removeCombined: true,
    skipDirOptimize: true,
    dir: "prod",
    optimize: "uglify2",
    preserveLicenseComments: false,
    optimizeCss: "standard",
    modules: [
        {
            name: "indexRequire"
        },{
            name: 'secondRequire'
        }
    ],
    paths: {
        collections: 'js/collections',
        views: "js/views",
        configs: 'js/configs',
        controls: 'js/controls',
        'controls-android': 'js/controls-android',
        'controls-base': 'js/controls-base',
        'controls-ios': 'js/controls-ios',
        'models': 'js/models',
        skins: 'js/skins',
        widgets: 'js/widgets',
        '../index': 'index',
        '../secondScreen': 'secondScreen'
    },
    generateSourceMaps: false
})