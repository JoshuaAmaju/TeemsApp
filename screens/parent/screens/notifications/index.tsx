import {formatDistanceToNow} from 'date-fns';
import {Box, HStack, VStack} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Text, Title} from 'react-native-paper';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useMutation, useQueryClient} from 'react-query';

import Trash from './assets/trash.svg';
import Union from './assets/union.svg';

import {Key, useNotifications, Notification} from '../../data/notification';

export default function Notifications() {
  // const [width, setWidth] = useState(100)

  const client = useQueryClient();

  const query = useNotifications();

  const mutation = useMutation<any, any, {id: number}>({
    onSuccess: () => {
      client.invalidateQueries(Key);
    },
    // mutationFn: args => notif.removeNotification(args.id),
    onMutate: ({id}) => {
      client.cancelQueries(Key);

      const notifs = client.getQueryData<Notification[]>(Key);

      if (notifs) {
        client.setQueryData(
          Key,
          notifs.filter(n => n.id !== id),
        );
      }
    },
  });

  return (
    <SwipeListView
      data={query.data}
      rightOpenValue={-100}
      refreshing={query.isLoading}
      onRefresh={() => query.refetch()}
      keyExtractor={item => item.id.toString()}
      ItemSeparatorComponent={() => <Box h={5} />}
      contentContainerStyle={{paddingVertical: 24, minHeight: '100%'}}
      ListEmptyComponent={
        <VStack h="100%" space={6} alignItems="center" justifyContent="center">
          <Union width={130} height={130} />
          <Title style={{color: Colors.grey500}}>
            Sorry you have no Notifications
          </Title>
        </VStack>
      }
      renderHiddenItem={({item: {id}}) => (
        <TouchableOpacity
          onPress={() => mutation.mutate({id})}
          style={{width: 100, alignSelf: 'flex-end'}}
          // onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
          <VStack space={1} style={styles.action}>
            <Trash width={20} height={20} color="#fff" />
            <Text style={{color: '#fff'}}>Delete</Text>
          </VStack>
        </TouchableOpacity>
      )}
      renderItem={({item}) => (
        <Box px={6} bg="#fff">
          <VStack space={2} style={styles.notification}>
            <HStack
              space={2}
              alignItems="center"
              justifyContent="space-between">
              <Text style={{fontWeight: '700'}}>{item.title}</Text>

              <Text numberOfLines={1} style={{flex: 1, color: Colors.grey500}}>
                {formatDistanceToNow(item.timestamp, {addSuffix: true})}
              </Text>
            </HStack>

            <Text>{item.content}</Text>
          </VStack>
        </Box>
      )}
    />
  );
}

const styles = StyleSheet.create({
  notification: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
  },
  action: {
    padding: 24,
    height: '100%',
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
