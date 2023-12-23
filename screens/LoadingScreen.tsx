import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import LoadingStyle from "../styles/LoadingStyle.scss";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export default function LoadingScreen() {
  const [isConnected, setIsConnected] = useState(true);

  async function network() {
    NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ? true : false);
    });
  }
  useEffect(() => {
    network();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/Images/Artboard-3.png")}
      resizeMode="cover"
      style={LoadingStyle.LoadingScreenContainer}
    >
      <TouchableOpacity
        style={LoadingStyle.LoadingScreenImage}
        onPress={() => {
          network();
        }}
        activeOpacity={1}
      >
        <View style={LoadingStyle.LoadingImageContainer}>
          {isConnected ? (
            <Image
              source={require("../assets/Images/18-location-pin-gradient.gif")}
              style={LoadingStyle.LoadingImageStyle}
            />
          ) : (
            <Text style={LoadingStyle.LoadingNointernetacess}>No internet</Text>
          )}
        </View>
        <View style={LoadingStyle.LogoImageContainer}>
          {/* <Image
            source={
              isConnected
                ? require("../assets/Images/Logo-1.png")
                : require("../assets/Images/wifi.gif")
            }
            resizeMode="contain"
            style={LoadingStyle.LogoImageStyle}
          /> */}
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}
