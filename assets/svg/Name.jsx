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
      d="M12 12C9.78125 12 8 10.2188 8 8C8 5.8125 9.78125 4 12 4C14.1875 4 16 5.8125 16 8C16 10.2188 14.1875 12 12 12ZM14.7812 13C17.0938 13 19 14.9063 19 17.2188V18.5C19 19.3438 18.3125 20 17.5 20H6.5C5.65625 20 5 19.3438 5 18.5V17.2188C5 14.9063 6.875 13 9.1875 13H9.71875C10.4063 13.3438 11.1875 13.5 12 13.5C12.8125 13.5 13.5625 13.3438 14.25 13H14.7812Z"
      fill="#8A53C2"
    />
  </Svg>
);
export default SVGComponent;
