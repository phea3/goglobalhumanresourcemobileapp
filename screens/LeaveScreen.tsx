import { useState, useEffect, useContext } from "react";
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import { useQuery } from "@apollo/client";
import HomeStyle from "../styles/HomeStyle.scss";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { GET_LEAVE_LIST } from "../graphql/RequestLeave";
import { AuthContext } from "../Context/AuthContext";
import * as Animatable from "react-native-animatable";
import { PanGestureHandler, State } from "react-native-gesture-handler";

export default function LeaveScreen() {
  const navigate = useNavigate();
  const [leavListData, setLeaveData] = useState([]);
  const [limit, setLimit] = useState(10);
  const { dimension } = useContext(AuthContext);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const { data, refetch } = useQuery(GET_LEAVE_LIST, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: (data) => {
      // console.log(data?.getLeaveListForMobile);
      setLeaveData(data?.getLeaveListForMobile);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);
  // Define animated values and handlers
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
        },
      },
    ],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: {
    nativeEvent: { oldState: number; translationX: number };
  }) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // You can perform actions when the swipe ends here
      // For example, navigate to the next screen if swiped enough
      if (event.nativeEvent.translationX > -100) {
        // Perform navigation or any other action
        // console.log("Swiped left, perform action");
        if (event.nativeEvent.translationX > 200) {
          // console.log(event.nativeEvent.translationX);
          navigate("/home");
        }
      }

      // Reset the translation value
      translateX.setValue(0);
    }
  };

  // Use Animated.timing for continuous updates outside gesture context
  const updateTranslationX = () => {
    Animated.timing(translateX, {
      toValue: 0, // Reset value to 0 when negative
      duration: 100000, // Adjust the duration as needed
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };
  updateTranslationX();
  // Call the updateTranslationX function periodically (for example, every 500ms)
  setInterval(updateTranslationX, 1000);

  return (
    <View style={LeaveStyle.LeaveContainer}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={{
            flex: 1,
            width: "100%",
            transform: [{ translateX: translateX }],
          }}
        >
          <View style={LeaveStyle.LeaveBackButtonContainer}>
            <TouchableOpacity
              onPress={() => navigate("/home")}
              style={LeaveStyle.LeaveBackButton}
            >
              <Image
                source={require("../assets/Images/back-dark-blue.png")}
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveBackButtonIconSM
                    : LeaveStyle.LeaveBackButtonIcon
                }
              />
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveBackButtonTitleSM
                    : LeaveStyle.LeaveBackButtonTitle
                }
              >
                Leaves
              </Text>
            </TouchableOpacity>
          </View>
          <View style={LeaveStyle.LeaveTitlesContainer}>
            <View style={LeaveStyle.LeaveTitleLeftContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveTitleTextSM
                    : LeaveStyle.LeaveTitleText
                }
              >
                Discription
              </Text>
            </View>
            <View style={LeaveStyle.LeaveTitleLeftContainer1}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveTitleTextSM
                    : LeaveStyle.LeaveTitleText
                }
              >
                Date
              </Text>
            </View>
            <View style={LeaveStyle.LeaveTitleContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveTitleTextSM
                    : LeaveStyle.LeaveTitleText
                }
              >
                Shift
              </Text>
            </View>
            <View style={LeaveStyle.LeaveTitleContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? LeaveStyle.LeaveTitleTextSM
                    : LeaveStyle.LeaveTitleText
                }
              >
                Status
              </Text>
            </View>
          </View>
          {load ? (
            <View style={HomeStyle.HomeContentContainer}>
              <Image
                source={require("../assets/Images/loader-1.gif")}
                style={{ width: 100, height: 100 }}
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ alignItems: "center" }}
              style={{ flex: 1, width: "100%" }}
              showsVerticalScrollIndicator={false}
            >
              {leavListData?.map((attendance: any, index: number) => (
                <Animatable.View
                  style={LeaveStyle.LeaveBodyContainer}
                  key={index}
                  animation={load ? "fadeInUp" : "fadeInUp"}
                >
                  <View style={LeaveStyle.LeaveTitleLeftContainer}>
                    <Text
                      style={
                        dimension === "sm"
                          ? LeaveStyle.LeaveBodyReasonTextSM
                          : LeaveStyle.LeaveBodyReasonText
                      }
                    >
                      {attendance?.description}
                    </Text>
                  </View>
                  <View style={LeaveStyle.LeaveTitleLeftContainer1}>
                    <Text
                      style={
                        dimension === "sm"
                          ? LeaveStyle.LeaveBodyTextSM
                          : LeaveStyle.LeaveBodyText
                      }
                    >
                      {attendance?.date}
                    </Text>
                  </View>
                  <View style={LeaveStyle.LeaveTitleContainer}>
                    <Text
                      style={
                        dimension === "sm"
                          ? LeaveStyle.LeaveBodyTextSM
                          : LeaveStyle.LeaveBodyText
                      }
                    >
                      {attendance?.shife ? attendance?.shife : "--:--"}
                    </Text>
                  </View>
                  <View style={LeaveStyle.LeaveTitleContainer}>
                    <Text
                      style={[
                        dimension === "sm"
                          ? LeaveStyle.LeaveApproveTextSM
                          : LeaveStyle.LeaveApproveText,
                        {
                          color:
                            attendance?.status === "cancel"
                              ? "red"
                              : attendance?.status === "approve"
                              ? "green"
                              : attendance?.status === "pending"
                              ? "orange"
                              : "black",
                        },
                      ]}
                    >
                      {attendance?.status}
                    </Text>
                  </View>
                </Animatable.View>
              ))}

              {leavListData?.length >= limit ? (
                <TouchableOpacity
                  onPress={() => {
                    setLimit(10 + limit);
                  }}
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                  }}
                >
                  <Text
                    style={{
                      textTransform: "lowercase",
                      fontFamily: "Century-Gothic-Bold",
                      color: "#3c6efb",
                      fontSize: dimension === "sm" ? 12 : 16,
                    }}
                  >
                    {"see more..."}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}
