import React from 'react';
import {Container, Spacer, Padding, Col, Center, Body} from 'rnfui';
import {View, Platform} from 'react-native';
import {useLoginScreen} from './Hooks';
import {ScreenType} from '../../Types/ScreenType';
import {
  AppText,
  AppRow,
  AppLanguageSelector,
  AppButton,
  AppKeyboardSpacer,
  AppBottomView,
  AppCheckbox,
} from '../../Components/index';
import {leftColour} from '../../Config/GradientColor';
import {
  LoginForm,
  AuthenticationPopup,
  ChangePasswordPopup,
  Logo,
} from './Components/index';
import scaler from '../../Utilities/scaler';
import {useTranslation} from 'react-i18next';
import AppTheme from '../../Config/AppTheme';

function LoginScreen(props: ScreenType) {
  const {
    form,
    checkBoxHandler,
    checked,
    styles,
    goToForgetPassword,
    onSubmit,
    loading,
    goToSignup,
    showPopup,
    setShowPopup,
    changePasswordPopup,
    setShowChangePasswordPopup,
    gotoTermsConditions,
    language,
    openMail,
  } = useLoginScreen(props);
  const {t} = useTranslation();

  return (
    <Container statusBarBackgroundColor={leftColour} fullScreen>
      <Body>
        <View style={styles.upperView}>
          <Spacer size={Platform.OS === 'android' ? scaler(80) : scaler(40)} />
          <AppText
            type={'smallHeading'}
            color={AppTheme.color.primary}
            onPress={openMail}
            style={{
              alignSelf: language === 'AR' ? 'flex-start' : 'flex-end',
              paddingHorizontal: 15,
            }}>
            {t('contactUs')}
          </AppText>
          <Spacer size={scaler(40)} />
          <AppRow flex={0}>
            <Center allAxis>
              <Logo />
            </Center>
          </AppRow>
          <Spacer size={scaler(20)} />
          <AppRow flex={0}>
            <Padding horizontal size={scaler(60)}>
              <AppText type={'headingNormal'} style={{fontSize: scaler(26)}}>
                {t('selectlanguage')}
              </AppText>
            </Padding>
          </AppRow>
          <AppLanguageSelector />
        </View>
        <View style={styles.lowerView}>
          <Padding horizontal size={scaler(70)}>
            <AppText type={'headingLight'}>{t('login')}</AppText>
          </Padding>
          <LoginForm form={form} styles={styles}>
            <Padding horizontal size={scaler(30)}>
              <AppRow style={{alignItems: 'center'}} flex={0}>
                <AppRow style={{alignItems: 'center'}} flex={1}>
                  <AppCheckbox value={checked} onChange={checkBoxHandler} />
                  <Spacer horizontal size={scaler(8)} />
                  <AppText type={'heading'} style={{fontSize: scaler(26)}}>
                    {t('rememberme')}
                  </AppText>
                </AppRow>
                <Col flex={1} right>
                  <AppText
                    type={'heading'}
                    style={{fontSize: scaler(26)}}
                    // style={{fontWeight: '100'}}
                    onPress={goToForgetPassword}>
                    {t('forgetPassword')}
                  </AppText>
                </Col>
              </AppRow>
            </Padding>

            <Spacer size={scaler(24)} />
            <Center>
              <AppButton
                onPress={onSubmit}
                height={scaler(91)}
                loading={loading}>
                {t('login')}
              </AppButton>
            </Center>
            <Spacer size={scaler(27)} />
            <Padding
              horizontal
              size={scaler(48)}
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <AppText
                type={'heading'}
                onPress={() => {
                  setShowPopup(true);
                }}
                style={{textDecorationLine: 'underline', fontSize: scaler(26)}}>
                {t('useAuth')}
              </AppText>
            </Padding>
            <Spacer size={10} />
          </LoginForm>
          <Spacer size={70} />
        </View>
      </Body>
      <AppBottomView>
        <AppText
          type={'subHeading'}
          style={{fontSize: scaler(32), fontWeight: '400'}}
          light
          onPress={goToSignup}>
          {t('newUser')}
          <AppText style={{fontSize: scaler(32)}} type={'heading'} light>
            {t('signup')}
          </AppText>
        </AppText>
      </AppBottomView>
      <AppKeyboardSpacer />
      <AuthenticationPopup
        visible={showPopup}
        toggleVisibility={setShowPopup}
        toggleChangePassword={setShowChangePasswordPopup}
      />
      <ChangePasswordPopup
        visible={changePasswordPopup}
        toggleVisibility={setShowChangePasswordPopup}
      />
    </Container>
  );
}

export default LoginScreen;
