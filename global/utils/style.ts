import {Platform, StyleSheet} from 'react-native';

export enum Inset {
  large = 24,
  medium = 10,
  small = 5,
}

export enum Color {
  purple = '#B6739F',
  deepPurple = '#622C4D',
  bitterSweet = '#FF6600',

  black = '#000000',
  lighGrey = '#F1F1F1',
  extrLightGrey = '#FAFAFA',

  white = '#FEFEFE',
  red = '#FF0000',
}

export enum Radius {
  large = 10,
  medium = 8,
  small = 5,
}

export class ButtonStyle {
  static container = StyleSheet.create({
    default: {
      borderRadius: Radius.small,
    },
    outline: {
      borderWidth: 1.5,
      borderColor: Color.bitterSweet,
    },
    contained: {
      backgroundColor: Color.bitterSweet,
    },
    small: {
      paddingHorizontal: Inset.small,
    },
    large: {
      paddingHorizontal: Inset.medium,
    },
  });

  static label = StyleSheet.create({
    default: {
      fontWeight: '600',
    },
    outline: {
      color: Color.bitterSweet,
    },
    contained: {
      color: Color.white,
    },
    small: {
      fontSize: 12,
    },
    large: {
      fontSize: 15,
    },
  });
}

export class Input {
  static container = StyleSheet.create({});
}

export class Fix {
  static elevate = {
    ...Platform.select({
      ios: {zIndex: 100},
      android: {elevation: 100},
    }),
  };
}
