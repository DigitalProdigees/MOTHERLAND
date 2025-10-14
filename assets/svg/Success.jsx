import * as React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={162}
    height={162}
    viewBox="0 0 162 162"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      opacity={0.03}
      d="M161 81C161 100.617 153.94 118.584 142.221 132.5C133.318 143.073 121.727 151.307 108.5 156.148C99.9249 159.287 90.6625 161 81 161C36.8172 161 1 125.183 1 81C1 36.8172 36.8172 1 81 1C125.183 1 161 36.8172 161 81Z"
      fill="url(#paint0_linear_8673_8943)"
    />
    <Path
      d="M146.106 127.5C155.482 114.396 161 98.3422 161 81C161 36.8172 125.183 1 81 1C63.2877 1 46.9198 6.75621 33.665 16.5M117.5 152.207C106.557 157.828 94.1487 161 81 161C67.0435 161 53.9218 157.426 42.5 151.144M4.35556 58C2.17273 65.2843 1 73.0052 1 81C1 93.9489 4.07646 106.179 9.53833 117"
      stroke="url(#paint1_linear_8673_8943)"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M70.6875 104.058L49.9375 83.199C48.6875 81.9424 48.6875 79.8063 49.9375 78.5497L54.4375 74.0262C55.6875 72.7696 57.6875 72.7696 58.9375 74.0262L73.0625 88.0995L103.063 57.9424C104.313 56.6859 106.313 56.6859 107.563 57.9424L112.063 62.466C113.312 63.7225 113.312 65.8586 112.063 67.1152L75.3125 104.058C74.0625 105.314 71.9375 105.314 70.6875 104.058Z"
      fill="url(#paint2_linear_8673_8943)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_8673_8943"
        x1={-19.4}
        y1={-14.2}
        x2={182.6}
        y2={190.6}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F708F7" />
        <Stop offset={0.483045} stopColor="#C708F7" />
        <Stop offset={1} stopColor="#F76B0B" />
      </LinearGradient>
      <LinearGradient
        id="paint1_linear_8673_8943"
        x1={-19.4}
        y1={-14.2}
        x2={182.6}
        y2={190.6}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F708F7" />
        <Stop offset={0.483045} stopColor="#C708F7" />
        <Stop offset={1} stopColor="#F76B0B" />
      </LinearGradient>
      <LinearGradient
        id="paint2_linear_8673_8943"
        x1={40.84}
        y1={52.44}
        x2={98.7926}
        y2={130.781}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F708F7" />
        <Stop offset={0.483045} stopColor="#C708F7" />
        <Stop offset={1} stopColor="#F76B0B" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SVGComponent;
