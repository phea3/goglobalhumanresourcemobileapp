import { Platform, StatusBar } from "react-native";
import Router from "./Router";
import { NativeRouter as Routers, useNavigation } from "react-router-native";
import { useNavigate, useLocation } from "react-router-native";
import { MenuProvider } from "react-native-popup-menu";
import StyleProvider from "./styleProvider";
import { AuthProvider } from "./Context/AuthContext";
import ApolloConfig from "./Config/ApolloConfig";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  // const navigation = useNavigation();

  // function handleBackButtonClick() {
  //   // navigation.goBack();
  //   return true;
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       "hardwareBackPress",
  //       handleBackButtonClick
  //     );
  //   };
  // }, []);

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MenuProvider>
          <StyleProvider>
            <AuthProvider>
              <ApolloConfig>
                <Routers>
                  <StatusBar
                    barStyle={
                      Platform.OS === "android"
                        ? "dark-content"
                        : "light-content"
                    }
                  />
                  <Router />
                </Routers>
              </ApolloConfig>
            </AuthProvider>
          </StyleProvider>
        </MenuProvider>
      </GestureHandlerRootView>
    </>
  );
}
