import {
  Navigate,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router-native";
import LoadingScreen from "./screens/LoadingScreen";
import Layout from "./layouts/Layout";
import HomeScreen from "./screens/HomeScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import { useContext, useEffect, useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import { AuthContext } from "./Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLoginUser from "./Hook/useLoginUser";
import { Alert, BackHandler, Dimensions, Platform } from "react-native";
import HomeMainScreen from "./screens/HomeMainScreen";
import HomeLeaveScreen from "./screens/HomeLeaveScreen";
import LeaveScreen from "./screens/LeaveScreen";
import { usePushNotifications } from "./usePushNotifications";
import ChecKAttendance from "./screens/CheckAttendance";
import AttendanceScreen from "./screens/AttendanceScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import * as Location from "expo-location";
import NotificationLayout from "./layouts/NotificationLayout";
import NotificationActiveScreen from "./screens/NotificationActiveScreen";
import NotificationMeetingScreen from "./screens/NotificationMeetingScreen";
import MeetingScreen from "./screens/MeetingScreen";
import LoginLayout from "./layouts/LoginLayout";
import ReportScreen from "./screens/ReportScreen";
import DailyAttendance from "./screens/DailyAttendance";
import MemberScreen from "./screens/MemberScreen";
import MeetingDetail from "./screens/MeetingDatail";
import RequestMeetingScreen from "./screens/RequesetMeetingScreen";
import EvaluationScreen from "./screens/EvaluationScreen";
import EvaluationDetailScreen from "./screens/EvaluationDetailScreen";

export default function Router() {
  const { expoPushToken, notificationResponse } = usePushNotifications();
  const navigate = useNavigate();
  const local = useLocation();
  const [load, setLoad] = useState(true);
  const { token, defineDimension } = useContext(AuthContext);
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  let locationToBack = local?.pathname;

  useEffect(() => {
    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => {
        backHandler.remove();
      };
    }
  }, [local]);

  const handleBackPress = () => {
    console.log("Back button pressed!", locationToBack);
    if (token !== "" && token !== undefined) {
      if (
        locationToBack == "/meeting" ||
        locationToBack == "/report" ||
        locationToBack == "/check" ||
        locationToBack == "/leave" ||
        locationToBack == "/profile" ||
        locationToBack == "/attendance" ||
        locationToBack == "/home/leave" ||
        locationToBack == "/notification/action" ||
        locationToBack == "/notification/meeting" ||
        locationToBack == "/"
      ) {
        navigate("/home/main");
      } else if (locationToBack == "/report/daily-attendace") {
        navigate("/report");
      } else if (locationToBack == "/report/valuation-report") {
        navigate("/report");
      } else if (locationToBack == "/report/valuation-detail") {
        navigate("/report/valuation-report");
      } else if (
        locationToBack == "/member" ||
        locationToBack == "/requestmeeting" ||
        locationToBack == "/meetingdetail"
      ) {
        navigate("/meeting");
      } else {
        BackHandler.exitApp();
      }
    } else {
      if (locationToBack == "/forgot-pass") {
        navigate("/login");
      } else {
        BackHandler.exitApp();
      }
    }
    return true;
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  useEffect(() => {
    async function getLocalStorage() {
      let userToken = await AsyncStorage.getItem("@userToken");
      let userUid = await AsyncStorage.getItem("@userUid");
      //
      if (userToken && userUid) {
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: userToken,
            uid: userUid,
          },
        });
      } else {
        dispatch({
          type: REDUCER_ACTIONS.LOGIN,
          payload: {
            email: "example@user.com",
            token: "",
            uid: "",
          },
        });
      }

      defineDimension({
        dimension: "",
        widthscreen: width,
        heightscreen: height,
      });
      //
    }
    getLocalStorage();
  }, []);

  const [locate, setLocation] = useState<Location.LocationObject | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied.");

  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);

  //     const locationSubscription = await Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.High,
  //         timeInterval: 5000, // Set the interval to 2000 milliseconds (2 seconds)
  //         distanceInterval: 1,
  //       },
  //       (newLocation) => {
  //         setLocation(newLocation);
  //       }
  //     );

  //     return () => {
  //       if (locationSubscription) {
  //         locationSubscription.remove();
  //       }
  //     };
  //   })();
  // }, [local.pathname, load]);
  // console.log(notificationResponse);

  async function getIDUserLog() {
    if (
      notificationResponse?.notification?.request?.content?.data?.type ===
      "leave"
    ) {
      setTimeout(() => {
        navigate("/notification/action");
      }, 500);
    } else if (
      notificationResponse?.notification?.request?.content?.data?.type ===
        "leave" ||
      notificationResponse?.notification?.request?.content?.data?.type ===
        "Pleave"
    ) {
      // console.log(notificationResponse?.notification?.request?.content);
      setTimeout(() => {
        navigate("/notification");
      }, 500);
    }
  }

  useEffect(() => {
    getIDUserLog();
  }, [notificationResponse]);

  const loadScreen = useRoutes([
    { path: "/", element: <LoadingScreen /> },
    { path: "/*", element: <NotFoundScreen /> },
  ]);

  const Content = useRoutes([
    { path: "/login", element: <Navigate to="/" /> },
    {
      path: "/",
      element: <Layout expoPushToken={expoPushToken} />,
      children: [
        { path: "/", element: <Navigate to="/home" /> },
        {
          path: "/home",
          element: <HomeScreen />,
          children: [
            { path: "/home", element: <Navigate to="/home/main" /> },
            { path: "/home/main", element: <HomeMainScreen /> },
            { path: "/home/leave", element: <HomeLeaveScreen /> },
          ],
        },
        { path: "/leave", element: <LeaveScreen /> },
        {
          path: "/check",
          element: <ChecKAttendance locating={locate} />,
        },
        { path: "/attendance", element: <AttendanceScreen /> },
        { path: "/profile", element: <ProfileScreen /> },
        {
          path: "/meeting",
          element: <MeetingScreen />,
        },
        {
          path: "/requestmeeting",
          element: <RequestMeetingScreen />,
        },
        {
          path: "/meetingdetail",
          element: <MeetingDetail />,
        },
        {
          path: "/member",
          element: <MemberScreen />,
        },
        {
          path: "/report",
          element: <ReportScreen />,
        },
        { path: "/report/daily-attendace", element: <DailyAttendance /> },
        { path: "/report/valuation-report", element: <EvaluationScreen /> },
        {
          path: "/report/valuation-detail",
          element: <EvaluationDetailScreen />,
        },
        {
          path: "/notification",
          element: <NotificationLayout />,
          children: [
            {
              path: "/notification",
              element: <Navigate to="/notification/action" />,
            },
            {
              path: "/notification/action",
              element: <NotificationActiveScreen />,
            },
            {
              path: "/notification/meeting",
              element: <NotificationMeetingScreen />,
            },
          ],
        },
        { path: "/*", element: <NotFoundScreen /> },
      ],
    },
  ]);

  const Login = useRoutes([
    {
      path: "/login",
      element: <Navigate to="/" />,
    },
    {
      path: "/",
      element: <LoginLayout />,
      children: [
        { path: "/", element: <LoginScreen /> },
        { path: "/login", element: <LoginScreen /> },
        { path: "/forgot-pass", element: <ForgotPasswordScreen /> },
        { path: "/*", element: <NotFoundScreen /> },
      ],
    },
  ]);

  // useEffect(() => {
  //   if (errorMsg === "Permission to access location was denied.") {
  //     Alert.alert("Oop!", "Permission to access location was denied.");
  //   }
  // }, [errorMsg]);

  // console.log(locate, errorMsg);

  if (
    // !locate &&
    // errorMsg !== "Permission to access location was denied." &&
    load === true
  ) {
    return loadScreen;
  } else {
    if (token !== "" && token !== undefined) {
      return Content;
    } else {
      return Login;
    }
  }
}
