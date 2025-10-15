import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const PlusAdd = (props) => (
  <Svg
    width={46}
    height={46}
    viewBox="0 0 46 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect x={1} y={1} width={44} height={44} rx={22} fill="white" fillOpacity={0.1} />
    <Rect x={0.5} y={0.5} width={45} height={45} rx={22.5} stroke="white" strokeOpacity={0.3} />
    <Path
      d="M29.8571 21.2857H24.7143V16.1429C24.7143 15.5357 24.1786 15 23.5714 15H22.4286C21.7857 15 21.2857 15.5357 21.2857 16.1429V21.2857H16.1429C15.5 21.2857 15 21.8214 15 22.4286V23.5714C15 24.2143 15.5 24.7143 16.1429 24.7143H21.2857V29.8571C21.2857 30.5 21.7857 31 22.4286 31H23.5714C24.1786 31 24.7143 30.5 24.7143 29.8571V24.7143H29.8571C30.4643 24.7143 31 24.2143 31 23.5714V22.4286C31 21.8214 30.4643 21.2857 29.8571 21.2857Z"
      fill="white"
    />
  </Svg>
);

export default PlusAdd;
