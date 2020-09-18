import scaler from '../../../Utilities/scaler';
import {ScreenType} from '../../../Types/ScreenType';
import {useForm} from 'react-hook-form';
import {useState, useMemo, useEffect} from 'react';
import {useActiveTheme} from 'rnfui';
import {StyleSheet, Keyboard, Platform, Alert, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateAppState} from '../../../Redux/appAction';
import {useHTTP, useToast, useBackHandler} from '../../../Hooks';
import AsyncStorage from '@react-native-community/async-storage';
import {AppStateType} from '../../../Types/AppStateType';
import DataStore from '../../../Utilities/DataStore';
import messaging from '@react-native-firebase/messaging';

function useLoginScreen({navigation}: ScreenType) {
  
  const [checked, setChecked] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [changePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const {errorToast, appPopUp} = useToast();
  const Theme = useActiveTheme();
  const dispatch = useDispatch();
  const language = useSelector((state: AppStateType) => state.language);
  useEffect(()=>{
    
    form.reset({email:"",password:""})
  },[language])
  navigation.setOptions({
    headerShown: false,
  });

  useBackHandler();

  const API_PROVIDER = useHTTP();

  const checkBoxHandler = () => {
    setChecked(!checked);
  };

  const gotoTermsConditions = () => {
    navigation.navigate('Terms');
  };
  const openMail = () => {
    Linking.openURL('mailto:info@smartciti-solutions.com?subject=GCS&body=Dear GCS Team,');
  };

  async function setToken() {
    await messaging().registerForRemoteNotifications();
    const enabled = await messaging().requestPermission();
    Alert.alert('enable?' + JSON.stringify(enabled));

    try {
      const fcmTokenString = await messaging().getToken();
      if (fcmTokenString) {
        const fcmToken = fcmTokenString;
        DataStore.FcmToken = fcmTokenString;
        console.log('FCM TOKEN--', fcmTokenString);
        // Alert.alert('Token onLogin = ' + JSON.stringify(fcmTokenString));
      } 
    } catch (error) {
      // Alert.alert('onLogin Error = ' + error);
    }
  }

  // const userDataString = await AsyncStorage.getItem('userData');
  const styles = useMemo(
    () =>
      StyleSheet.create({
        upperView: {
          backgroundColor: 'white',
          justifyContent: 'flex-end',
        },
        lowerView: {
          width: 'auto',
          flex: 1,
          backgroundColor: '#f2f2f2',
        },
        logoStyle: {
          height: scaler(160),
          width: scaler(128),
        },
        helperTextStyle: {
          textAlign: language === 'AR' ? 'right' : 'left',
        },
      }),
    [language],
  );

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    
  });


  const onSubmit = form.handleSubmit((data: any) => {
    

    // Alert.alert("FcmToken = "+DataStore.FcmToken)

    if ( DataStore.btnLoding ) {
      return;
    }


      DataStore.loading = true;


    Keyboard.dismiss();
    const requestBody = {
      email: data.email,
      password: data.password,
      device_id: Platform.OS === 'android' ? 'android' : 'ios',
      device_token: DataStore.FcmToken,
      timestamp:Math.round((new Date()).getTime() / 1000),
      language:language
    };

    
      API_PROVIDER.initiateRequest(
        {
          url: '/userLogin',
          method: 'POST',
          data: requestBody,
        },
        async (response: any) => {
          if (response.status === 200) {
            if (response.data?.data) {
              await AsyncStorage.setItem(
                'userData',
                JSON.stringify(response.data.data),
              );
              DataStore.userData = response.data.data;
              if (checked) {
                AsyncStorage.setItem('credentials', JSON.stringify(data));
              } else {
                AsyncStorage.removeItem('credentials');
              }
              dispatch(updateAppState('loggedIn', true));
            }
          }
        },
        (error: any) => {
          if (error.response?.data?.message) {
            // errorToast(error.response.data.message);
            appPopUp(error.response.data.message);
            DataStore.loading=false
          }
        },
      );
    

      setTimeout(() => {
        DataStore.loading = false;
      }, 300);

  });

  const goToForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  const rememberMeHandler = async () => {
    try {
      const credentialsString = await AsyncStorage.getItem('credentials');
      if (credentialsString) {
        const credentials = JSON.parse(credentialsString);
        form.reset(credentials);
      }
    } catch (error) {
      form.reset({
        email: '',
        password: '',
      });
    }
  };

  useEffect(() => {
    rememberMeHandler();
  }, []);

  return {
    form,
    checkBoxHandler,
    checked,
    Theme,
    styles,
    onSubmit,
    goToForgetPassword,
    loading: API_PROVIDER.loading,
    goToSignup,
    showPopup,
    setShowPopup,
    changePasswordPopup,
    setShowChangePasswordPopup,
    gotoTermsConditions,
    openMail,
    language
  };
}

export default useLoginScreen;
