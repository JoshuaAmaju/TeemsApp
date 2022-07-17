module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: [
          '.ios.{js|ts|tsx}',
          '.android.{js|ts|tsx}',
          '.js',
          '.ts',
          '.tsx',
          '.json',
        ],
        alias: {
          '@lib': ['./lib/'],
          '@global': ['./global/'],
          '@screens': ['./screens/'],
          '@exports': ['./exports/'],
          '@utils': ['./global/utils/'],
          '@assets': ['./global/assets/'],
          '@stores': ['./global/stores/'],
          '@components': ['./global/components/'],
        },
      },
    ],
  ],
};
