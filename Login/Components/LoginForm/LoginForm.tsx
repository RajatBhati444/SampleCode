import React, {Fragment, useMemo} from 'react';
import FormBuilder from 'react-native-paper-form-builder';
import {AppInput} from '../../../../Components/index';
import {Spacer, Padding} from 'rnfui';
import scaler from '../../../../Utilities/scaler';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

function LoginForm({form, styles, children}: any) {
  const {t} = useTranslation();
  const {language} = useSelector((state: any) => state);

  const formConfigArray: any = useMemo(
    () => [
      {
        name: 'email',
        type: 'input',
        label: t('emailAddess'),
        placeholder: t('emailAddess'),
        rules: {
          required: {
            value: true,
            message: t('emailReq'),
          },
          pattern: {
            value: '[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+',
            // /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
            message: t('invalidEmail'),
          },
        },
        textInputProps: {
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        },
      },
      {
        name: 'password',
        type: 'input',
        label: t('password'),
        placeholder: t('enterPassword'),
        rules: {
          required: {
            value: true,
            message: t('passRequired'),
          },
        },
        textInputProps: {
          keyboardType: 'default',
          secureTextEntry: true,
        },
      },
    ],
    [language],
  );

  return (
    <Fragment>
      <Spacer size={scaler(36)} />
      <Padding horizontal size={scaler(40)}>
        <FormBuilder
          formConfigArray={formConfigArray}
          form={form}
          CustomInput={AppInput}
          helperTextStyle={styles.helperTextStyle}>
          {children}
        </FormBuilder>
      </Padding>
    </Fragment>
  );
}

export default LoginForm;
