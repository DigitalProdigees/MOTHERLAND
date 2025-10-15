import * as React from "react";
import Svg, { Rect } from "react-native-svg";

const Drawer = (props) => (
  <Svg
    width={32}
    height={28}
    viewBox="0 0 32 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={32} height={4} rx={2} fill="white" />
    <Rect y={12} width={24} height={4} rx={2} fill="white" />
    <Rect y={24} width={16} height={4} rx={2} fill="white" />
  </Svg>
);

export default Drawer;
