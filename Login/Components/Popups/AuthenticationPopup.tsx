import React, {useState, useEffect, useCallback, Fragment} from 'react';
import {Modal, IconButton, Surface, Avatar} from 'react-native-paper';
import {
  Padding,
  Spacer,
  Body,
  useActiveTheme,
  VisibilityToggle,
  Center,
  Row,
  Click,
} from 'rnfui';
import {Dimensions, View, Keyboard, Alert} from 'react-native';
import scaler from '../../../../Utilities/scaler';
import {
  AppText,
  AppRow,
  AppInput,
  AppButton,
  AppKeyboardSpacer,
} from '../../../../Components/index';
import FormBuilder from 'react-native-paper-form-builder';
import {useForm} from 'react-hook-form';
import {useHTTP, useToast} from '../../../../Hooks';
import DataStore from '../../../../Utilities/DataStore';
import AsyncStorage from '@react-native-community/async-storage';
import {debounce} from 'lodash';
import {useSelector} from 'react-redux';
import {AppStateType} from '../../../../Types/AppStateType';
import { useTranslation } from 'react-i18next';

const {height, width} = Dimensions.get('screen');

function AuthenticationPopup({
  visible,
  toggleVisibility,
  toggleChangePassword,
}: any) {
  const {t} = useTranslation()
  const [showVerificationForm, setShowVerificationForm] = useState(true);
  const API_PROVIDER = useHTTP();
  const {errorToast, successToast, appPopUp} = useToast();
  const Theme = useActiveTheme();
  const language = useSelector((state: AppStateType) => state.language);
  const form = useForm({
    defaultValues: {
      verificationCode: '',
    },
    mode: 'onChange',
  });
  const resendForm = useForm({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    AsyncStorage.getItem('count').then(data => {
      if (data) {
        DataStore.count = JSON.parse(data);
      }
    });
  }, []);

  const checkExtingEmail = async (value: string) => {
    if (API_PROVIDER.loading) {
      return;
    }
    return new Promise((res, rej) => {
      if (
        !/[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/.test(
          value,
        )
      ) {
        return res(true);
      }
      API_PROVIDER.initiateRequest(
        {
          url: '/checkuniqeEmail',
          data: {
            email: value,
            timestamp: Math.round((new Date()).getTime() / 1000),
          },
          method: 'POST',
        },
        (response: any) => {
          if (response.status === 200) {
            // res(true);
            res('Email address doesnt exist in our system');
          }
        },
        (error: any) => {
          res(true);
          // res('Email Address already exists');
        },
      );
    });
  };

  const verifyAuthenticationCode = form.handleSubmit((data: any) => {
    if ( DataStore.btnLoding ) {
      return;
    }
    if (DataStore.count > 2) {
      return appPopUp(
        t('threeTrials'),
      );
    }
    Keyboard.dismiss();
    const requestBody = {
      otp: data.verificationCode,
    };
    API_PROVIDER.initiateRequest(
      {
        url: '/verifyOtp',
        method: 'POST',
        data: requestBody,
      },
      async (response: any) => {
        if (response.status === 200) {
          if (response.data?.data) {
            toggleVisibility(false);

            setTimeout(() => {
              DataStore.userData = response.data.data;
              if (DataStore.userData?.user_id) {
                toggleChangePassword(true);
              } else {
                appPopUp(t('otpExpired'));
              }
            }, 2000);
          }
        }
      },
      (error: any) => {
        DataStore.count++;
        AsyncStorage.setItem('count', JSON.stringify(DataStore.count));
        if (error.response?.data?.message) {
          appPopUp(error.response.data.message);
        }
      },
    );
  });

  const resendVerificationCode = resendForm.handleSubmit((data: any) => {
    if ( DataStore.btnLoding ) {
      return;
    }
    Keyboard.dismiss();
    const requestBody = {
      email: data.email,
      requestType: 1,
    };
    API_PROVIDER.initiateRequest(
      {
        url: '/UserOtpResend',
        method: 'POST',
        data: requestBody,
      },
      async (response: any) => {
        if (response.status === 200) {
          console.log(response.data.message);
          if (response.data) {
            DataStore.count = 0;
            setShowVerificationForm(true);
            if (response.data?.message) {
              // successToast(response.data.message);
              appPopUp(response.data.message);
            }
          }
          DataStore.count = 0;
          AsyncStorage.removeItem('count');
        }
      },
      (error: any) => {
        if (error.response?.data?.message) {
          // errorToast(error.response.data.message);
          appPopUp(error.response.data.message);
        }
      },
    );
  });
  const handler = useCallback(debounce(resendVerificationCode, 100), []);

  return (
  
      <Modal
      visible={visible}
      onDismiss={() => {
        toggleVisibility(false);
      }}
      contentContainerStyle={{alignItems: 'center',}}>
      <Surface
        style={{
          width: width - scaler(80),
          borderRadius: scaler(40),
          overflow: 'hidden',
          elevation: 5,
          
        }}>
        <VisibilityToggle visible={showVerificationForm}>
          <Body style={{borderRadius: scaler(20),}}>
            <IconButton
              icon={'close'}
              style={{
                alignSelf: language === 'AR' ? 'flex-start' : 'flex-end',
                right: language === 'AR' ? scaler(-25) : scaler(25),
                top: scaler(25),
              }}
              onPress={() => toggleVisibility(false)}></IconButton>

            <Padding size={scaler(50)}>
              <AppRow flex={0}>
                <AppText type={'heading'} style={{fontSize: scaler(26)}}>
                { t('authCode')}
                </AppText>
              </AppRow>
              <AppRow flex={0}>
                <Padding right>
                  <AppText
                    type={'heading'}
                    style={{
                      fontWeight: '400',
                      fontSize: scaler(26),
                      // color: Theme.color.overlay,
                    }}>
                 {t('enterAuthCode')}
                  </AppText>
                </Padding>
              </AppRow>
              <Spacer size={scaler(50)} />
              <FormBuilder
                form={form}
                formConfigArray={[
                  {
                    type: 'input',
                    name: 'verificationCode',
                    label: t('verificationCode'),
                    rules: {
                      required: {
                        value: true,
                        message: t('verificationCodeReq'),
                      },
                    },
                    textInputProps: {
                      keyboardType: 'number-pad',
                    },
                  },
                ]}
                CustomInput={AppInput}
              />
              <Center>
                <AppText
                  type={'headingNormal'}
                  color={Theme.color.primary}
                  onPress={() => {
                    setShowVerificationForm(false);
                  }}>
                  {t('resend')}
                </AppText>
              </Center>
              <Spacer size={scaler(20)} />
              <Padding size={scaler(150)} horizontal>
                <AppButton
                  loading={ DataStore.btnLoding }
                  onPress={verifyAuthenticationCode}>
                  {t('verify')}
                </AppButton>
              </Padding>
              <Spacer size={scaler(25)} />
            </Padding>
          
          </Body>
      
        </VisibilityToggle>
        <VisibilityToggle visible={!showVerificationForm}>
          <Body style={{borderRadius: scaler(20)}}>
            <IconButton
              icon={'close'}
              style={{
                alignSelf: language === 'AR' ? 'flex-start' : 'flex-end',
                right: language === 'AR' ? scaler(-25) : scaler(25),
                top: scaler(25),
              }}
              onPress={() => {
                toggleVisibility(false);
              }}></IconButton>
            <Padding size={scaler(50)}>
              <AppRow flex={0}>
                <AppText type={'heading'} style={{fontSize: scaler(26)}}>
                  {t('authCode')}
                </AppText>
              </AppRow>
              <AppRow flex={0}>
                <Padding right>
                  <AppText
                    type={'heading'}
                    style={{
                      fontWeight: '100',
                      fontSize: scaler(26),
                      // color: Theme.color.overlay,
                    }}>
                    {t('enterAuthCode')}
                  </AppText>
                </Padding>
              </AppRow>
              <Spacer size={scaler(25)} />
              <FormBuilder
                form={resendForm}
                formConfigArray={[
                  {
                    type: 'input',
                    name: 'email',
                    label: t('emailAddess'),
                    rules: {
                      required: {
                        value: true,
                        message: t('emailAddReq'),
                      },
                      pattern: {
                        value:
                          '[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+',
                        // /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                        message: t('invalidEmailAdd'),
                      },
                      // validate: {
                      //   value: async (value: any) =>
                      //     await checkExtingEmail(value),
                      // },
                    },
                    textInputProps: {
                      keyboardType: 'email-address',
                      autoCapitalize: 'none',
                    },
                  },
                ]}
                CustomInput={AppInput}
              />

              <Spacer size={scaler(25)} />
              <Padding size={scaler(150)} horizontal>
                <AppButton loading={API_PROVIDER.loading} onPress={handler}>
                  {t('submit')}
                </AppButton>
              </Padding>
              <Spacer size={scaler(25)} />

              <Center>
                <Row>
              <AppText type={'title'}>{t('pleaseClick')}</AppText>
                  <AppText
                    type={'title'}
                    color={Theme.color.primary}
                    onPress={() => {
                      setShowVerificationForm(true);
                    }}>
                    {' '}
                    {t('here')}{' '}
                  </AppText>
                  <AppText type={'title'}>{t('enterVarCode')}</AppText>
                </Row>
              </Center>

              <Spacer size={scaler(25)} />
            </Padding>
          </Body>
        </VisibilityToggle>
      
      </Surface>
      <AppKeyboardSpacer/>
    </Modal>
   
  
  );
}

export default AuthenticationPopup;
