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
      d="M17.5 11C18.3125 11 19 11.6875 19 12.5V18.5C19 19.3438 18.3125 20 17.5 20H6.5C5.65625 20 5 19.3438 5 18.5V12.5C5 11.6875 5.65625 11 6.5 11H7.25V8.75C7.25 6.15625 9.375 4 12 4C14.5938 4 16.75 6.15625 16.75 8.75V11H17.5ZM14.25 11V8.75C14.25 7.53125 13.2188 6.5 12 6.5C10.75 6.5 9.75 7.53125 9.75 8.75V11H14.25Z"
      fill="#8A53C2"
    />
  </Svg>
);
export default SVGComponent;
