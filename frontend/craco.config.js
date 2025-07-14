module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source map warnings for specific packages
      if (webpackConfig.ignoreWarnings) {
        webpackConfig.ignoreWarnings.push(
          (warning) =>
            warning.module &&
            warning.module.resource &&
            (
              warning.module.resource.includes('standardized-audio-context') ||
              warning.module.resource.includes('extendable-media-recorder')
            ) &&
            warning.message.includes('Failed to parse source map')
        );
      } else {
        webpackConfig.ignoreWarnings = [
          (warning) =>
            warning.module &&
            warning.module.resource &&
            (
              warning.module.resource.includes('standardized-audio-context') ||
              warning.module.resource.includes('extendable-media-recorder')
            ) &&
            warning.message.includes('Failed to parse source map')
        ];
      }
      return webpackConfig;
    },
  },
};
