import React from "react";
import { Image } from "react-native";
import scaler from "../../../../Utilities/scaler";
import images from "../../../../assets";

function Logo() {
  return (
    <Image
      style={{ height: scaler(160), width: scaler(128) }}
      source={images.logo}
    />
  );
}

export default Logo;
