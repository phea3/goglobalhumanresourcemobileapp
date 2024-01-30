import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { useLocation, useNavigate } from "react-router-native";
import { useMutation } from "@apollo/client";
import { EMPLOYEECHECKATTENDANCE } from "../graphql/EmployeeCheckAttendance";
import CheckStyle from "../styles/CheckStyle.scss";
import { useContext, useEffect, useState } from "react";
import HomeStyle from "../styles/HomeStyle.scss";
import ModalStyle from "../styles/ModalStyle.scss";
import * as Location from "expo-location";
import CheckModal from "../components/CheckModal";
import { AuthContext } from "../Context/AuthContext";
import SwiperPage from "../includes/SwiperPage";
import { moderateScale } from "../ Metrics";
import ModalCheckIn from "../components/ModalCheckIn";
import ModalCheckOut from "../components/ModalCheckOut";

export default function ChecKAttendance({ locating }: any) {
  const locate = useLocation();
  const navigate = useNavigate();
  const [isVisible, setVisible] = useState(false);
  const [CheckInIsVisible, setCheckInVisible] = useState(false);
  const [CheckOutIsVisible, setCheckOutVisible] = useState(false);
  const [scanType, setScanType] = useState("");
  const { dimension } = useContext(AuthContext);
  const [checkData, setCheckData] = useState<{
    message: string;
    status: boolean | null;
  }>({
    message: "",
    status: null,
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [load, setLoad] = useState(true);

  const handleCheckInClose = () => {
    setCheckInVisible(false);
  };

  const handleCheckOutClose = () => {
    setCheckOutVisible(false);
  };

  const handleCheckInOpen = () => {
    setCheckInVisible(true);
  };

  const handleCheckOutOpen = () => {
    setCheckOutVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setCheckData({
        message: "",
        status: null,
      });
    }, 500);
    setLocation(null);
    setLoad(true);
  };

  const handleOpen = () => {
    setVisible(true);
  };

  const handleLocationPermission = async () => {
    try {
      // Request foreground location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      // Handle the permission status
      if (status === "granted") {
        console.log("Foreground location permission granted");
        // Perform actions that require foreground location permission here
      } else {
        console.log("Foreground location permission denied");
        // Handle denied permission (e.g., show a message to the user)
        Alert.alert(
          "Permission Denied",
          "Foreground location permission is required for this feature.",
          [
            {
              text: "Settings",
              onPress: () => Linking.openSettings(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error requesting foreground location permission:", error);
      // Handle errors if any
    }
  };

  const [employeeCheckAttendance] = useMutation(EMPLOYEECHECKATTENDANCE, {
    onCompleted: ({ employeeCheckAttendance }) => {
      setCheckData({
        message: employeeCheckAttendance?.message,
        status: employeeCheckAttendance?.status,
      });
      setLoad(false);
      handleOpen();
      if (checkData) {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    },
    onError: (error: any) => {
      // console.log("Fail", error?.message);
      setCheckData({
        message: error?.message,
        status: error?.status,
      });
      setLoad(false);
      handleOpen();
      setTimeout(() => {
        handleClose();
      }, 2000);
    },
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonDisabledOut, setIsButtonDisabledOut] = useState(false);

  //=============================  CHECK IN ===========================
  const handleCheckInButton = async () => {
    if (isButtonDisabled) {
      return;
    }
    setIsButtonDisabled(true);
    let createValue = {
      longitude: location?.coords.longitude
        ? location?.coords.longitude.toString()
        : "",
      latitude: location?.coords.latitude
        ? location?.coords.latitude.toString()
        : "",
      shift: morning ? "morning" : afternoon ? "afternoon" : "",
      scan: "checkIn",
    };
    // console.log(createValue);

    try {
      await employeeCheckAttendance({
        variables: {
          ...createValue,
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  //=============================  CHECK OUT ===========================
  const handleCheckOutButton = async () => {
    if (isButtonDisabledOut) {
      return;
    }
    setIsButtonDisabledOut(true);
    let createValue = {
      longitude: location?.coords.longitude
        ? location?.coords.longitude.toString()
        : "",
      latitude: location?.coords.latitude
        ? location?.coords.latitude.toString()
        : "",
      shift: morning ? "morning" : afternoon ? "afternoon" : "",
      scan: "checkOut",
    };
    // console.log(createValue);
    try {
      await employeeCheckAttendance({
        variables: {
          ...createValue,
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    } finally {
      setIsButtonDisabledOut(false);
    }
  };

  const getLocationIn = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Low,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          if (location?.coords.longitude && location?.coords?.longitude) {
            setLocation(location);
          }
        }
      );
    } catch (error) {}
  };

  const getLocationOut = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Low,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          if (location?.coords.latitude && location?.coords?.longitude) {
            console.log(location?.coords.latitude, location?.coords?.longitude);
            setLocation(location);
          }
        }
      );
    } catch (error) {}
  };

  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    // Update state to indicate that the user is scrolling
    setIsScrolling(true);

    // You can perform additional actions while the user is scrolling
    // For example, you might want to update UI elements or fetch more data
  };

  const handleScrollEnd = () => {
    // Update state to indicate that the user has stopped scrolling
    setIsScrolling(false);

    // Perform additional actions when scrolling stops
  };

  useEffect(() => {
    if (errorMsg === "Permission to access location was denied.") {
      Alert.alert("Oop!", "Permission to access location was denied.");
    } else if (errorMsg === "Error getting location") {
      Alert.alert("Error getting location");
    }
  }, [errorMsg]);

  if (errorMsg) {
    return (
      <View
        style={[
          LeaveStyle.LeaveContainer,
          {
            borderTopLeftRadius: moderateScale(20),
            borderTopRightRadius: moderateScale(20),
          },
        ]}
      >
        <View style={LeaveStyle.LeaveBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={[LeaveStyle.LeaveBackButton, { padding: moderateScale(15) }]}
          >
            <Image
              source={require("../assets/Images/back-dark-blue.png")}
              style={{
                width: moderateScale(20),
                height: moderateScale(20),
                marginRight: moderateScale(10),
              }}
            />
            <Text
              style={[
                LeaveStyle.LeaveBackButtonTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              Leave Check
            </Text>
          </TouchableOpacity>
        </View>
        <View style={CheckStyle.LeaveErrorConainer}>
          <TouchableOpacity
            onPress={() => {
              handleLocationPermission();
            }}
            style={{
              backgroundColor: "#082b9e",
              padding: moderateScale(10),
              marginTop: moderateScale(5),
            }}
          >
            <Text
              style={[
                CheckStyle.LeaveErrorTitle,
                { fontSize: moderateScale(16) },
              ]}
            >
              Permission to access location was denied.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <>
        {/* ============= Ask For Check Attendance ============= */}
        <ModalCheckIn
          location={location}
          CheckInIsVisible={CheckInIsVisible}
          handleCheckInClose={handleCheckInClose}
          handleCheckInButton={handleCheckInButton}
          isButtonDisabled={isButtonDisabled}
        />

        {/* ====================================  Modal Check Out ======================= */}
        <ModalCheckOut
          location={location}
          CheckOutIsVisible={CheckOutIsVisible}
          handleCheckOutClose={handleCheckOutClose}
          handleCheckOutButton={handleCheckOutButton}
          isButtonDisabledOut={isButtonDisabledOut}
        />

        {/* ============= Alert After Check Attendance ============= */}
        <CheckModal
          location={location}
          isVisible={isVisible}
          handleClose={handleClose}
          data={checkData}
          load={load}
        />
        <View
          style={[
            CheckStyle.CheckContainer,
            {
              borderTopLeftRadius: moderateScale(20),
              borderTopRightRadius: moderateScale(20),
            },
          ]}
        >
          <SwiperPage path={"/home"} page="checkAtt" isScrolling={isScrolling}>
            <View style={LeaveStyle.LeaveBackButtonContainer}>
              <TouchableOpacity
                onPress={() => navigate("/home")}
                style={[
                  LeaveStyle.LeaveBackButton,
                  { padding: moderateScale(15) },
                ]}
              >
                <Image
                  source={require("../assets/Images/back-dark-blue.png")}
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                    marginRight: moderateScale(10),
                  }}
                />
                <Text
                  style={[
                    LeaveStyle.LeaveBackButtonTitle,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Check In/Out
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={[
                CheckMainStyle.shadow,
                {
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: moderateScale(10),
                  borderRadius: moderateScale(10),
                  // borderWidth: moderateScale(1),
                  // borderColor: "#dcdcdc",
                },
              ]}
              style={{
                flex: 1,
                width: "100%",
                padding: moderateScale(10),
              }}
              onScroll={handleScroll}
              onScrollEndDrag={handleScrollEnd}
              onMomentumScrollEnd={handleScrollEnd}
              scrollEventThrottle={16}
            >
              <View
                style={[
                  HomeStyle.HomeMainSelectDateButtonLabelContainer,
                  { height: moderateScale(40) },
                ]}
              >
                <Text
                  style={[
                    HomeStyle.HomeMainSelectDateButtonLabel,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Select Shifts
                </Text>
              </View>
              <View style={CheckStyle.CheckMainSelectDateSection}>
                <TouchableOpacity
                  style={[
                    CheckStyle.CheckMainSelectDateButton,
                    {
                      height: moderateScale(40),
                      marginRight: moderateScale(10),
                      paddingHorizontal: moderateScale(10),
                      borderRadius: moderateScale(10),
                    },
                  ]}
                  onPress={() => {
                    setMorning(true);
                    setAfternoon(false);
                  }}
                >
                  <Image
                    source={
                      morning
                        ? require("../assets/Images/rec.png")
                        : require("../assets/Images/reced.png")
                    }
                    resizeMode="contain"
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectDateButtonPlaceholder,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    Morning
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    CheckStyle.CheckMainSelectDateButton,
                    {
                      height: moderateScale(40),
                      marginRight: moderateScale(10),
                      borderRadius: moderateScale(10),
                    },
                  ]}
                  onPress={() => {
                    setMorning(false);
                    setAfternoon(true);
                  }}
                >
                  <Image
                    source={
                      afternoon
                        ? require("../assets/Images/rec.png")
                        : require("../assets/Images/reced.png")
                    }
                    resizeMode="contain"
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectDateButtonPlaceholder,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    Afternoon
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  CheckStyle.CheckInButtonContainer,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                    marginVertical: moderateScale(10),
                  },
                ]}
                onPress={async () => {
                  handleCheckInOpen();
                  getLocationIn();
                }}
              >
                <Text
                  style={[
                    CheckStyle.CheckButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  CHECK IN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  CheckStyle.CheckOutButtonContainer,
                  {
                    padding: moderateScale(10),
                    borderRadius: moderateScale(10),
                    marginBottom: moderateScale(10),
                  },
                ]}
                onPress={() => {
                  handleCheckOutOpen();
                  getLocationOut();
                }}
              >
                <Text
                  style={[
                    CheckStyle.CheckButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  CHECK OUT
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </SwiperPage>
        </View>
      </>
    );
  }
}

const CheckMainStyle = StyleSheet.create({
  shadow: {
    shadowColor: "#082b9e",
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(3.84),

    elevation: moderateScale(5),
  },
});
