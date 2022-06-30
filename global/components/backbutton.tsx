import {ChevronLeftCircle} from '@exports/icons';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Icon, IconButton} from 'native-base';

export default function BackButton() {
  const nav = useNavigation();

  return (
    <IconButton
      size={25}
      onPress={() => nav.goBack()}
      icon={
        <Icon
          as={(props: any) => {
            console.log(props);

            return <ChevronLeftCircle />;
          }}
        />
      }
    />
  );
}
