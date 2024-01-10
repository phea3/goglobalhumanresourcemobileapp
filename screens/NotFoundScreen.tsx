import { Text, View } from "react-native";
import { moderateScale } from "../ Metrics";

export default function NotFoundScreen() {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Century-Gothic-Bold",
          fontSize: moderateScale(14),
        }}
      >
        Oop, Screen not found!
      </Text>
    </View>
  );
}
