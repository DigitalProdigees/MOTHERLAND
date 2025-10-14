import * as React from "react";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={15}
    height={24}
    viewBox="0 0 15 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M0.382798 11.0928C-0.127599 11.5876 -0.127599 12.4124 0.382798 12.9072L11.3847 23.6289C11.9518 24.1237 12.8025 24.1237 13.3129 23.6289L14.6172 22.3643C15.1276 21.8694 15.1276 21.0447 14.6172 20.4948L5.88374 11.9725L14.6172 3.50515C15.1276 2.95533 15.1276 2.13058 14.6172 1.63574L13.3129 0.371134C12.8025 -0.123711 11.9518 -0.123711 11.3847 0.371134L0.382798 11.0928Z"
      fill="url(#paint0_linear_8673_9021)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_8673_9021"
        x1={-1.9125}
        y1={-2.28}
        x2={25.4887}
        y2={15.0832}
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
