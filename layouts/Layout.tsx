import {
  View,
  Text,
  SafeAreaView,
  Alert,
  ImageBackground,
  Image,
  AppState,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router";
import Header from "../includes/Header";
import LayoutStyle from "../styles/LayoutStyle.scss";
import { useQuery } from "@apollo/client";
import { GET_USER_MOBILE_LOGIN } from "../graphql/GetUserMobileLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate, useLocation } from "react-router-native";
import useLoginUser from "../Hook/useLoginUser";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { GET_EMPLOYEEBYID } from "../graphql/GetEmployeeById";
import { NetworkConsumer, useIsConnected } from "react-native-offline";
import * as Animatable from "react-native-animatable";
import { moderateScale } from "../ Metrics";
import NetInfo from "@react-native-community/netinfo";

const Layout = ({ expoPushToken }: any) => {
  const isConnected = useIsConnected();
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const offheight = useSharedValue(0);
  const color = useSharedValue("red");
  const onStateChange = useCallback((state: any) => {
    AsyncStorage.setItem("@mobileUserLogin", JSON.stringify(state));
  }, []);

  const { data: UserData, refetch: UserRefetch } = useQuery(
    GET_USER_MOBILE_LOGIN,
    {
      pollInterval: 2000,
      variables: {
        token: expoPushToken?.data ? expoPushToken?.data : "",
      },
      onCompleted: ({ getUserMobileLogin }) => {
        if (getUserMobileLogin) {
          onStateChange(getUserMobileLogin);
        }
        //========= Set Online Mode =========
        if (isConnected === true) {
          offheight.value = withTiming(10);
          color.value = withTiming("#4CBB17");
          setTimeout(() => {
            offheight.value = withTiming(0);
          }, 1000);
        }
      },

      onError(error) {
        //========= Set Offline Mode =========
        if (isConnected === false) {
          offheight.value = withTiming(10);
          color.value = withTiming("red");
        }
        if (error?.message === "Not Authorized") {
          Alert.alert("Opp! Your session has been expired.", "", [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.removeItem("@userToken");
                await AsyncStorage.setItem("@userUid", JSON.stringify(null));
                dispatch({
                  type: REDUCER_ACTIONS.LOGOUT,
                });
                navigate("/");
              },
            },
          ]);
        }
      },
    }
  );

  const { data: employeeData, refetch: employeeRefetch } = useQuery(
    GET_EMPLOYEEBYID,
    {
      variables: {
        id: UserData?.getUserMobileLogin?.user?._id,
      },
      onCompleted: ({ getEmployeeById }) => {
        if (getEmployeeById?.workingStatus === "resign") {
          Alert.alert("Opp! Your session has been expired.", "", [
            {
              text: "OK",
              onPress: async () => {
                await AsyncStorage.removeItem("@userToken");
                await AsyncStorage.setItem("@userUid", JSON.stringify(null));
                dispatch({
                  type: REDUCER_ACTIONS.LOGOUT,
                });
                navigate("/");
              },
            },
          ]);
        }
      },
    }
  );

  useEffect(() => {
    UserRefetch();
  }, [expoPushToken?.data, location.pathname]);

  useEffect(() => {
    employeeRefetch();
  }, [UserData?.getUserMobileLogin?.user?._id]);

  //============== Detect Connection App ================
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: withSpring(offheight.value),
      backgroundColor: withSpring(color.value),
    };
  });

  const [connection, setConnection] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [connectionType, setConnectionType] = useState("");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type:", state?.type);
      setConnectionType(state?.type);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAppStateChange = (nextAppState: any) => {
    setAppState(nextAppState);
  };

  useEffect(() => {
    // Subscribe to app state changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup the subscription on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // console.log(appState);
    if (isConnected === true) {
      setTimeout(() => {
        setConnection(isConnected === true ? true : false);
      }, 1000);
    } else {
      setTimeout(() => {
        setConnection(isConnected === false ? false : true);
      }, 1000);
    }
  }, [isConnected, appState, connectionType]);

  useEffect(() => {
    if (connection === true) {
      offheight.value = withTiming(10);
      color.value = withTiming("#4CBB17");
      setTimeout(() => {
        offheight.value = withTiming(0);
      }, 1000);
    } else if (connection === false) {
      offheight.value = withTiming(10);
      color.value = withTiming("#ff0000");
    } else {
      setTimeout(() => {
        offheight.value = withTiming(0);
      }, 1000);
    }
  }, [connection]);

  const ImageViewer = () => (
    <NetworkConsumer>
      {({ isConnected }) =>
        isConnected ? null : (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                backgroundColor: "#000",
                opacity: 0.4,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <Animatable.View
              animation={"fadeInUp"}
              style={{
                position: "absolute",
                borderWidth: 1,
                borderColor: "red",
                padding: moderateScale(10),
                width: "90%",
                height: moderateScale(60),
                borderRadius: moderateScale(10),
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: "red",
                top: moderateScale(120),
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                  backgroundColor: "white",
                  borderRadius: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/Images/wifi.gif")}
                  resizeMode="contain"
                  style={{
                    width: moderateScale(25),
                    height: moderateScale(25),
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: moderateScale(13),
                    fontFamily: "Century-Gothic-Bold",
                  }}
                >
                  Oops, your internet connection is not stable.
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: moderateScale(12),
                    fontFamily: "Kantumruy-Bold",
                  }}
                >
                  អ៉ីនធឺណិតរបស់លោកអ្នកមានភាពរអាក់រអួល
                </Text>
              </View>
            </Animatable.View>
          </View>
        )
      }
    </NetworkConsumer>
  );

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            location.pathname === "/notification" ||
            location.pathname === "/notification/action" ||
            location.pathname === "/notification/meeting"
              ? "#ffffff"
              : "#0D3AA9",
          justifyContent: "flex-end",
        }}
      >
        <View style={LayoutStyle.LayoutCoverFooter} />
        <ImageBackground
          source={require("../assets/Images/book_cover-08.png")}
          resizeMode="cover"
          style={LayoutStyle.LoginLayoutContainer}
        >
          <View style={LayoutStyle.LayoutContainer}>
            <Header />
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: 0,
                },
                animatedStyles,
              ]}
            />
            <View style={LayoutStyle.LayoutOutletContainer}>
              <Outlet />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
      <ImageViewer />
    </>
  );
};

export default Layout;
