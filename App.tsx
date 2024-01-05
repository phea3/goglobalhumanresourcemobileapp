import { Platform, StatusBar } from "react-native";
import Router from "./Router";
import { NativeRouter as Routers } from "react-router-native";
import { useNavigate, useLocation } from "react-router-native";
import { MenuProvider } from "react-native-popup-menu";
import StyleProvider from "./styleProvider";
import { AuthProvider } from "./Context/AuthContext";
import ApolloConfig from "./Config/ApolloConfig";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Disable the default back button behavior
        return true;
      }
    );

    return () => {
      // Unsubscribe from the back button event when the component is unmounted
      backHandler.remove();
    };
  }, []);

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
