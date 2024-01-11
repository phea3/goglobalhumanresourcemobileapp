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
import SwiperPage from "../includes/SwiperPage";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";

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

  return (
    <View
      style={[
        LeaveStyle.LeaveContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
        },
      ]}
    >
      <SwiperPage path={"/home"} page="leave" isScrolling={isScrolling}>
        <View style={LeaveStyle.LeaveBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={[
              HomeStyle.HomeFeaturesTitleButton,
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
              Leaves
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            LeaveStyle.LeaveTitlesContainer,
            { height: moderateScale(40) },
          ]}
        >
          <View
            style={[
              LeaveStyle.LeaveTitleLeftContainer,
              { marginLeft: moderateScale(6) },
            ]}
          >
            <Text
              style={[
                LeaveStyle.LeaveTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Discription
            </Text>
          </View>
          <View style={LeaveStyle.LeaveTitleLeftContainer1}>
            <Text
              style={[
                LeaveStyle.LeaveTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Date
            </Text>
          </View>
          <View style={LeaveStyle.LeaveTitleContainer}>
            <Text
              style={[
                LeaveStyle.LeaveTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Shift
            </Text>
          </View>
          <View style={LeaveStyle.LeaveTitleContainer}>
            <Text
              style={[
                LeaveStyle.LeaveTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Status
            </Text>
          </View>
        </View>
        {load ? (
          <View style={HomeStyle.HomeContentContainer}>
            <Image
              source={require("../assets/Images/loader-1.gif")}
              style={{
                width: moderateScale(100),
                height: moderateScale(100),
              }}
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            style={{ flex: 1, width: "100%" }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
          >
            {leavListData?.map((attendance: any, index: number) => (
              <Animatable.View
                style={[
                  LeaveStyle.LeaveBodyContainer,
                  { height: moderateScale(55) },
                ]}
                key={index}
                animation={load ? "fadeInUp" : "fadeInUp"}
              >
                <View
                  style={[
                    LeaveStyle.LeaveTitleLeftContainer,
                    { marginLeft: moderateScale(6) },
                  ]}
                >
                  <Text
                    style={[
                      LeaveStyle.LeaveBodyReasonText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.description}
                  </Text>
                </View>
                <View style={LeaveStyle.LeaveTitleLeftContainer1}>
                  <Text
                    style={[
                      LeaveStyle.LeaveBodyText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.date}
                  </Text>
                </View>
                <View style={LeaveStyle.LeaveTitleContainer}>
                  <Text
                    style={[
                      LeaveStyle.LeaveBodyText,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {attendance?.shife ? attendance?.shife : "--:--"}
                  </Text>
                </View>
                <View style={LeaveStyle.LeaveTitleContainer}>
                  <Text
                    style={[
                      LeaveStyle.LeaveApproveText,
                      {
                        fontSize: moderateScale(12),
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
                  height: moderateScale(40),
                }}
              >
                <Text
                  style={{
                    textTransform: "lowercase",
                    fontFamily: "Century-Gothic-Bold",
                    color: "#3c6efb",
                    fontSize: moderateScale(16),
                  }}
                >
                  {"see more..."}
                </Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        )}
      </SwiperPage>
    </View>
  );
}
