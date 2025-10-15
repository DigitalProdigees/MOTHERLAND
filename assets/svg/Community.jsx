import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16 4C18.21 4 20 5.79 20 8C20 10.21 18.21 12 16 12C15.74 12 15.5 11.96 15.26 11.9C14.5 12.5 13.5 12.9 12.4 13C13.5 12.1 14.2 10.8 14.2 9.3C14.2 6.8 12.2 4.8 9.7 4.8C7.2 4.8 5.2 6.8 5.2 9.3C5.2 10.8 5.9 12.1 7 13C5.9 12.9 4.9 12.5 4.1 11.9C3.9 11.96 3.7 12 3.4 12C1.2 12 -0.6 10.2 -0.6 8C-0.6 5.8 1.2 4 3.4 4C3.7 4 3.9 4.04 4.1 4.1C4.9 3.5 5.9 3.1 7 3C5.9 3.9 5.2 5.2 5.2 6.7C5.2 9.2 7.2 11.2 9.7 11.2C12.2 11.2 14.2 9.2 14.2 6.7C14.2 5.2 13.5 3.9 12.4 3C13.5 3.1 14.5 3.5 15.3 4.1C15.5 4.04 15.7 4 16 4Z"
      fill="currentColor"
    />
  </Svg>
);
export default SVGComponent;
