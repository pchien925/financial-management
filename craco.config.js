module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      
      if (oneOfRule) {
        const babelLoader = oneOfRule.oneOf.find(
          (rule) => rule.loader && rule.loader.includes('babel-loader')
        );
        if (babelLoader) {
          if (!babelLoader.options) babelLoader.options = {};
          babelLoader.options.babelrc = true;
        }
      }

      return webpackConfig;
    },
  },
};