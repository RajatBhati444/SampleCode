import React, {useState} from 'react';
import {Dimensions, ImageBackground} from 'react-native';
import {ScreenType} from '../../Types/ScreenType';
import {Container, Click} from 'rnfui';
import LinearGradient from 'react-native-linear-gradient';
import {leftColour, rightColour} from '../../Config/GradientColor';
import {AppRow, AppText} from '../index';
import scaler from '../../Utilities/scaler';
import images from '../../assets';

function AppTopTabBar(props: any) {
  const {active, TabCreator, tabArray} = useTopNavigator(props);

  return (
    <Container statusBarBackgroundColor={leftColour} style={{flex: 1}}>
      <LinearGradient
        colors={[leftColour, rightColour]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <AppRow style={{height: scaler(110)}} flex={0}>
          {tabArray.map((data: any, index: number) => {
            return <TabCreator data={data} key={index} />;
          })}
        </AppRow>
      </LinearGradient>
      {tabArray[active].screen}
      {/* <Body style={{backgroundColor: 'grey'}}>{tabArray[active].screen}</Body> */}
    </Container>
  );

  function useTopNavigator({props, tabArray}: any) {
    const [active, setActiveHeading] = useState(0);
    const fullWidth = Dimensions.get('screen').width;

    const StateChange = (name: any) => {
      name === active ? null : setActiveHeading(name);
    };

    const TabCreator = (data: any) => {
      // console.log('func', data);
      return (
        <Click
          onPress={() => StateChange(data.data.key)}
          style={{
            width: fullWidth / tabArray.length,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: scaler(110),
          }}>
          <ImageBackground
            style={{
              flex: 1,
              width: fullWidth / 1.5,
              height: scaler(110),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={active == data.data.key ? images.selected : 0}>
            <AppText
              style={
                active == data.data.key
                  ? {fontWeight: '500'}
                  : {fontWeight: '300'}
              }
              color={'white'}
              type={active == data.data.key ? 'heading' : 'headingLight'}>
              {data.data.name}
            </AppText>
          </ImageBackground>
        </Click>
      );
    };

    return {
      active,
      fullWidth,
      StateChange,
      tabArray,
      TabCreator,
    };
  }
}

export default AppTopTabBar;

