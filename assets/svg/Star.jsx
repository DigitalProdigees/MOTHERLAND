import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Star = (props) => (
  <Svg
    width={23}
    height={23}
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z"
      fill="#8A53C2"
    />
  </Svg>
);

export default Star;
