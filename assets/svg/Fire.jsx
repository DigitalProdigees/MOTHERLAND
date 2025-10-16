import * as React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const Fire = (props) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M11.807 7.88101C11.8542 5.51101 8.2542 5.83673 9.17993 1.71387C9.17993 1.71387 6.76277 2.6653 7.18706 5.58387C7.33277 6.58673 6.98135 7.33673 6.98135 7.33673C6.62564 7.40959 6.07277 6.70244 6.26563 5.60959C6.26563 5.60959 4.99706 6.55673 4.99706 7.77384C4.99706 8.99101 5.5842 10.281 5.5842 10.281C4.12277 9.96384 4.26849 7.99246 4.26849 7.99246C4.26849 7.99246 3.34277 9.23101 3.34277 11.5667C3.34277 13.3838 5.39135 16.2853 8.69565 16.2853C11.9999 16.2853 14.6528 13.7225 14.6528 11.4425C14.6528 10.4438 14.3142 9.15384 13.5814 8.45101C13.5814 8.45101 13.6799 10.4438 12.6942 10.3496C12.6942 10.3496 13.5085 7.74819 12.6557 6.55673C12.6557 6.55673 12.2442 7.84246 11.807 7.88101Z"
      fill="url(#paint0_linear_8833_864)"
    />
    <Path
      d="M11.8112 6.09407C12.7711 4.32407 10.3926 4.07978 10.3883 2.99121C10.3883 2.99121 9.96828 4.11407 10.9712 4.88121C11.7897 5.50264 11.8112 6.09407 11.8112 6.09407Z"
      fill="url(#paint1_linear_8833_864)"
    />
    <Path
      d="M6.76275 2.70898C6.39846 3.06898 6.89989 4.55613 5.75989 5.14327C5.75989 5.14327 5.37417 3.51041 6.76275 2.70898Z"
      fill="url(#paint2_linear_8833_864)"
    />
    <Defs>
      <LinearGradient id="paint0_linear_8833_864" x1="9.72255" y1="16.688" x2="7.09531" y2="-2.3513" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FF0000"/>
        <Stop offset="0.2317" stopColor="#FF1500"/>
        <Stop offset="0.7367" stopColor="#FF3D00"/>
        <Stop offset="0.9987" stopColor="#FF4C00"/>
      </LinearGradient>
      <LinearGradient id="paint1_linear_8833_864" x1="12.8009" y1="16.2635" x2="10.1736" y2="-2.77591" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FF0000"/>
        <Stop offset="0.2317" stopColor="#FF1500"/>
        <Stop offset="0.7367" stopColor="#FF3D00"/>
        <Stop offset="0.9987" stopColor="#FF4C00"/>
      </LinearGradient>
      <LinearGradient id="paint2_linear_8833_864" x1="8.05102" y1="16.9195" x2="5.42377" y2="-2.11983" gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FF0000"/>
        <Stop offset="0.2317" stopColor="#FF1500"/>
        <Stop offset="0.7367" stopColor="#FF3D00"/>
        <Stop offset="0.9987" stopColor="#FF4C00"/>
      </LinearGradient>
    </Defs>
  </Svg>
);

export default Fire;
