const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const developmentConfig = require('./config/development');
const productionConfig = require('./config/production');
const config = process.env.DEVELOPMENT_TYPE === 'production' ? productionConfig : developmentConfig;

module.exports = withPlugins(
  [
    [
      optimizedImages,
      {
        inlineImageLimit: 8192,
        imagesFolder: 'images',
        imagesName: '[name]-[hash].[ext]',
        handleImages: ['jpeg', 'jpg', 'png', 'svg', 'webp', 'gif', 'ico'],
        optimizeImages: true,
        optimizeImagesInDev: false,
        mozjpeg: {
          quality: 80,
        },
        optipng: {
          optimizationLevel: 3,
        },
        pngquant: false,
        gifsicle: {
          interlaced: true,
          optimizationLevel: 3,
        },
        webp: {
          preset: 'default',
          quality: 75,
        },
      },
    ],
    [withCSS],
    [withFonts],
    [withSass],
  ],
  config
);
