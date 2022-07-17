import React, {createRef, useCallback, useState} from 'react';

import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {Color} from '@utils/style';

import Button from '@components/button';

import {useNavigation} from '@react-navigation/native';
import {Box, HStack, VStack} from 'native-base';

const {width} = Dimensions.get('screen');

const slides = [
  {
    image: require('./assets/scene_one.png'),
    title: 'Mobile & digital account for your kids.',
  },
  {
    title: 'Give your kids chores.',
    image: require('./assets/scene_two.png'),
  },
  {
    title: 'Give them rewards.',
    image: require('./assets/scene_three.png'),
  },
];

export default function Onboarding() {
  const nav = useNavigation();
  const ref = createRef<FlatList>();
  const [index, setIndex] = useState(0);
  const dimensions = useWindowDimensions();

  const isLast = index >= slides.length - 1;

  const skip = useCallback(() => nav.navigate('TypeSelector' as any), [nav]);

  const onNext = useCallback(() => {
    const newIndex = index + 1;
    ref.current?.scrollToIndex({index: newIndex, animated: true});
    setIndex(newIndex);
  }, [ref, index]);

  return (
    <View style={styles.screen}>
      <FlatList
        ref={ref}
        horizontal
        data={slides}
        style={{flex: 1}}
        pagingEnabled={true}
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{minHeight: '100%'}}
        onMomentumScrollEnd={({nativeEvent}) => {
          const {contentOffset} = nativeEvent;
          setIndex(contentOffset.x / width);
        }}
        renderItem={({item}) => {
          return (
            <View style={[styles.slide, {width: dimensions.width}]}>
              <Image
                source={item.image}
                resizeMode="contain"
                style={styles.cover}
              />

              <Box p={6} maxW={80}>
                <Text>{item.title}</Text>
              </Box>
            </View>
          );
        }}
      />

      <VStack p={6} space={16}>
        <HStack space={2}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, index === i && styles.activeDot]}
            />
          ))}
        </HStack>

        <HStack alignItems="center" justifyContent="space-between">
          <Button mode="outlined" onPress={skip} color={Color.purple}>
            Skip
          </Button>

          <Button onPress={isLast ? skip : onNext}>
            {isLast ? 'Get Started' : 'Next'}
          </Button>
        </HStack>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'flex-end',
  },
  cover: {
    margin: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 100,
    backgroundColor: '#C4C4C4',
  },
  activeDot: {
    backgroundColor: '#553044',
  },
});
