/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import Apple from '@/assets/svg/Apple';
import Back from '@/assets/svg/Back';
import Carousal1 from '@/assets/svg/Carousal1';
import Carousal2 from '@/assets/svg/Carousal2';
import Carousal3 from '@/assets/svg/Carousal3';
import City from '@/assets/svg/City';
import ConfirmPassword from '@/assets/svg/ConfirmPassword';
import Country from '@/assets/svg/Country';
import Crown from '@/assets/svg/Crown';
import Email from '@/assets/svg/Email';
import Google from '@/assets/svg/Google';
import Monthly from '@/assets/svg/Monthly';
import Name from '@/assets/svg/Name';
import Next from '@/assets/svg/Next';
import Password from '@/assets/svg/Password';
import State from '@/assets/svg/State';
import Success from '@/assets/svg/Success';
import Tag from '@/assets/svg/Tag';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    statusBar: '#222222',
  },
  dark: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    statusBar: '#222222',
  },
};

export const Fonts = {
  regular: 'Quicksand-Regular',
  light: 'Quicksand-Light',
  medium: 'Quicksand-Medium',
  semiBold: 'Quicksand-SemiBold',
  bold: 'Quicksand-Bold',
};

export const Icons = {
  Apple,
  Back,
  Carousal1,
  Carousal2,
  Carousal3,
  City,
  ConfirmPassword,
  Country,
  Crown,
  Email,
  Google,
  Monthly,
  Name,
  Next,
  Password,
  State,
  Success,
  Tag,
};
