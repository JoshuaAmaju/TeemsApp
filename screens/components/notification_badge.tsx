import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Badge, IconButton} from 'react-native-paper';

import {useNotifications} from '../parent/data/notification';

import Bell from '../assets/bell.svg';

export default function NotificationBadge({color = 'black'}: {color?: string}) {
  const nav = useNavigation();

  const {data} = useNotifications();

  return (
    <IconButton
      size={30}
      color={color}
      style={{borderWidth: 1, borderColor: '#D4D4D4'}}
      onPress={() => nav.navigate('Notifications' as any)}
      icon={({size, color}) => (
        <View>
          <Bell width={size} height={size} color={color} />
          {data && data.length > 0 && <Badge size={10} style={styles.badge} />}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    top: 0,
    right: 3,
    position: 'absolute',
    backgroundColor: '#FA802E',
  },
});
