import * as React from "react";
import Svg, {
    Defs,
    G,
    LinearGradient,
    Path,
    Rect,
    Stop,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const SVGComponent = (props) => (
  <Svg
    width={120}
    height={120}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_d_8673_6527)">
      <Rect
        x={32}
        y={16}
        width={56}
        height={56}
        rx={28}
        fill="url(#paint0_linear_8673_6527)"
        shapeRendering="crispEdges"
      />
      <Path
        d="M61.3 49.275C61.1 49.075 61.004 48.8333 61.012 48.55C61.02 48.2667 61.1243 48.025 61.325 47.825L64.15 45H53C52.7167 45 52.479 44.904 52.287 44.712C52.095 44.52 51.9993 44.2827 52 44C52 43.7167 52.096 43.479 52.288 43.287C52.48 43.095 52.7173 42.9993 53 43H64.15L61.3 40.15C61.1 39.95 61 39.7123 61 39.437C61 39.1617 61.1 38.9243 61.3 38.725C61.5 38.525 61.7377 38.425 62.013 38.425C62.2883 38.425 62.5257 38.525 62.725 38.725L67.3 43.3C67.4 43.4 67.471 43.5083 67.513 43.625C67.555 43.7417 67.5757 43.8667 67.575 44C67.575 44.1333 67.554 44.2583 67.512 44.375C67.47 44.4917 67.3993 44.6 67.3 44.7L62.7 49.3C62.5167 49.4833 62.2877 49.575 62.013 49.575C61.7383 49.575 61.5007 49.475 61.3 49.275Z"
        fill="white"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_8673_6527"
        x1={24.86}
        y1={10.68}
        x2={95.56}
        y2={82.36}
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
