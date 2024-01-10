import { Platform, StatusBar } from "react-native";
import { View } from "react-native";
import { Outlet } from "react-router-native";
import LayoutStyle from "../styles/LayoutStyle.scss";
import Tabview from "../includes/TabView";
import { moderateScale } from "../ Metrics";

export default function NotificationLayout() {
  return (
    <View style={LayoutStyle.NotificationLayoutContainer}>
      <Tabview />
      <View
        style={[
          LayoutStyle.NotificationLayoutBodyContainer,
          {
            borderTopLeftRadius: moderateScale(15),
            borderTopRightRadius: moderateScale(15),
          },
        ]}
      >
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
        />
        <Outlet />
      </View>
    </View>
  );
}
