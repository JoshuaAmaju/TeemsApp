import {ChevronLeftCircle} from '@exports/icons';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {IconButton} from 'react-native-paper';

export default function BackButton() {
  const nav = useNavigation();

  return (
    <IconButton
      size={25}
      onPress={() => nav.goBack()}
      icon={({size, color}) => (
        <ChevronLeftCircle width={size} color={color} height={size} />
      )}
    />
  );
}
