/* eslint-disable react/prop-types */
import React from 'react';
import { withStyles } from '@ui-kitten/components';
import { StackActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView, ScrollView, View } from 'react-native';
import LoaderButton from '../../components/LoaderButton';
import HeaderBar from '../../components/HeaderBar';

import i18n from '../../i18n';
import styles from './LanguageScreen.style';
import LanguageItem from '../../components/LanguageItem';

import { setLocale } from 'reducer/settingsSlice';

import { LANGUAGES } from '../../constants';
import AnalyticsHelper from 'helpers/AnalyticsHelper';
import { ACCOUNT_EVENTS } from 'constants/analyticsEvents';

import { selectLoggedIn } from 'reducer/authSlice';
import { selectLocale } from 'reducer/settingsSlice';

const LanguageScreenComponent = ({ eva: { style }, navigation }) => {
  const localeValue = useSelector(selectLocale) || 'en';
  const isLoggedIn = useSelector(selectLoggedIn);

  const dispatch = useDispatch();

  const onCheckedChange = ({ item }) => {
    dispatch(setLocale(item));
  };

  const onSubmitLanguage = () => {
    AnalyticsHelper.track(ACCOUNT_EVENTS.CHANGE_LANGUAGE, {
      language: localeValue,
    });

    if (isLoggedIn) {
      navigation.dispatch(StackActions.replace('Tab'));
    } else {
      navigation.dispatch(StackActions.replace('Login'));
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const languages = Object.keys(i18n.translations);

  return (
    <SafeAreaView style={style.container}>
      <HeaderBar title={i18n.t('SETTINGS.CHANGE_LANGUAGE')} showLeftButton onBackPress={goBack} />
      <ScrollView style={style.itemMainView}>
        {languages.map(item => {
          return (
            <LanguageItem
              key={LANGUAGES[item]}
              item={item}
              title={LANGUAGES[item]}
              isChecked={localeValue === item ? true : false}
              onCheckedChange={onCheckedChange}
            />
          );
        })}
        <View style={style.languageButtonView}>
          <LoaderButton
            style={style.languageButton}
            size="large"
            textStyle={style.languageButtonText}
            onPress={() => onSubmitLanguage()}
            text={i18n.t('SETTINGS.SUBMIT')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const LanguageScreen = withStyles(LanguageScreenComponent, styles);
export default LanguageScreen;
