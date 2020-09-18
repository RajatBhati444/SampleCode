import React, {useEffect} from 'react';
import {Modal, Surface} from 'react-native-paper';
import {Padding, Spacer, Body} from 'rnfui';
import {Dimensions, Keyboard} from 'react-native';
import scaler from '../../../../Utilities/scaler';
import {AppText, AppRow, AppInput, AppKeyboardSpacer} from '../../../../Components/index';
import FormBuilder from 'react-native-paper-form-builder';
import {useForm} from 'react-hook-form';
import {AppButton} from '../../../../Components/index';
import {useHTTP, useToast} from '../../../../Hooks';
import DataStore from '../../../../Utilities/DataStore';
import AppTheme from '../../../../Config/AppTheme';
import { useTranslation } from 'react-i18next';

const {height, width} = Dimensions.get('screen');

function ChangePasswordPopup({visible, toggleVisibility}: any) {
  const {t} = useTranslation()
  const API_PROVIDER = useHTTP();
  const {errorToast, successToast, appPopUp} = useToast();
  const form = useForm({
    defaultValues: {
      password: '',
      cnfPassword: '',
    },
    mode: 'onChange',
  });

  const changePassword = form.handleSubmit((data: any) => {
    if (API_PROVIDER.loading && !DataStore.userData?.user_id) {
      return;
    }
    Keyboard.dismiss();
    const requestBody = {
      password: data.password,
      user_id: DataStore.userData?.user_id,
    };
    API_PROVIDER.initiateRequest(
      {
        url: '/createPassword',
        method: 'POST',
        data: requestBody,
      },
      async (response: any) => {
        if (response.status === 200) {
          if (response.data?.data) {
            toggleVisibility(false);
            if (response.data.message) appPopUp(response.data.message);
            DataStore.userData = null;
          }
        }
      },
      (error: any) => {
        if (error.response?.data?.message) {
          appPopUp(error.response.data.message);
        }
      },
    );
  });

  return (
    <Modal
      visible={visible}
      onDismiss={() => {
        toggleVisibility(false);
      }}
      dismissable={false}
      contentContainerStyle={{alignItems: 'center'}}>
      <Surface
        style={{
          minHeight: height / 2,
          width: width - scaler(80),
          borderRadius: scaler(40),
          overflow: 'hidden',
          elevation: 5,
        }}>
        <Body style={{borderRadius: scaler(20)}}>
          <Padding size={scaler(50)}>
            <AppRow flex={0}>
              <AppText type={'heading'} style={{fontSize: scaler(26)}}>
                {t('changePassword')}
              </AppText>
            </AppRow>
            <AppRow flex={0}>
              <Padding right>
                <AppText
                  type={'headingLight'}
                  style={{
                    fontWeight: '400',
                    fontSize: scaler(26),
                    color: AppTheme.color.overlay,
                  }}>
                  {t('enterNewPass')}
                </AppText>
              </Padding>
            </AppRow>
            <Spacer />
            <FormBuilder
              form={form}
              formConfigArray={[
                {
                  type: 'input',
                  name: 'password',
                  label: t('password'),
                  rules: {
                    required: {
                      value: true,
                      message: t('passRequired'),
                    },
                    minLength: {
                      value: 6,
                      message: t('passwordShould6'),
                    },
                    maxLength: {
                      value: 15,
                      message: t('passBetween6'),
                    },
                  },
                  textInputProps: {
                    secureTextEntry: true,
                  },
                },
                {
                  type: 'input',
                  name: 'cnfPassword',
                  label: t('cnfPassword'),
                  rules: {
                    required: {
                      value: true,
                      message: t('cnfPasswordReq'),
                    },
                    validate: {
                      value: (value: any) =>
                        value === form.watch('password')
                          ? true
                          : t('passwordNotMatch'),
                    },
                  },
                  textInputProps: {
                    secureTextEntry: true,
                  },
                },
              ]}
              CustomInput={AppInput}
            />
            <Spacer size={scaler(75)} />
            <Padding size={scaler(100)} horizontal>
              <AppButton
                loading={ DataStore.btnLoding }
                onPress={changePassword}>
                {t('submit')}
              </AppButton>
            </Padding>
            <Spacer size={scaler(70)} />
          </Padding>
        </Body>
      </Surface>
      <AppKeyboardSpacer/>
    </Modal>
  );
}

export default ChangePasswordPopup;
