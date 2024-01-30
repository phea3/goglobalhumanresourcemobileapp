import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DailyAttendanceStyle from "../styles/DailyAttendanceStyle.scss";
import HomeStyle from "../styles/HomeStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_DAILY_ATTENDANCE_REPORT } from "../graphql/GetDailyAttendanceReport";
import * as Animatable from "react-native-animatable";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";
import SwiperPage from "../includes/SwiperPage";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { GETEVALUATIOINLISTFORMOBILE } from "../graphql/GetEvaluationListForMobile";

export default function EvaluationScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [dateIsvisble, setDateIsvisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [load, setLoad] = useState(true);
  const [dataload, setDataload] = useState(false);
  const [limit, setLimit] = useState(10);
  const { widthScreen } = useContext(AuthContext);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const [evaluationData, setEvaluationData] = useState([]);

  const { data, refetch } = useQuery(GETEVALUATIOINLISTFORMOBILE, {
    onCompleted: ({ getEvaluationListForMobile }) => {
      // console.log(getEvaluationListForMobile);
      setEvaluationData(getEvaluationListForMobile);
    },
    onError: (error: any) => {
      console.log(error?.message);
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
        DailyAttendanceStyle.DailyAttContainer,
        {
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
        },
      ]}
    >
      <SwiperPage path={"/report"} page="leave" isScrolling={isScrolling}>
        <View style={{ width: Platform.OS === "ios" ? "100%" : widthScreen }}>
          <TouchableOpacity
            onPress={() => navigate("/report")}
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
              Evaluations
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            LeaveStyle.LeaveTitlesContainer,
            { height: moderateScale(40) },
          ]}
        >
          <View style={[{ flex: 1, marginLeft: moderateScale(6) }]}>
            <Text
              style={[
                LeaveStyle.LeaveTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Type
            </Text>
          </View>
          <View style={{ flex: 3 / 2 }}>
            <Text
              style={[
                LeaveStyle.LeaveTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Date
            </Text>
          </View>
          <View>
            <View
              style={{
                width: moderateScale(20),
                height: moderateScale(20),
              }}
            />
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
            scrollEventThrottle={16}
          >
            {evaluationData
              ? evaluationData?.map((data: any, index: number) => (
                  <Animatable.View
                    style={[
                      LeaveStyle.LeaveBodyContainer,
                      { height: moderateScale(55) },
                    ]}
                    key={index}
                    animation={load ? "fadeInUp" : "fadeInUp"}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        navigate("/report/valuation-detail", {
                          state: data?._id,
                        });
                      }}
                      style={{ flex: 1, width: "100%", flexDirection: "row" }}
                    >
                      <View style={{ marginLeft: moderateScale(6), flex: 1 }}>
                        <Text
                          style={[
                            LeaveStyle.LeaveBodyReasonText,
                            {
                              fontSize: moderateScale(12),
                              fontFamily: "Century-Gothic-Bold",
                            },
                          ]}
                        >
                          {data?.evaluationType}
                        </Text>
                      </View>
                      <View style={{ flex: 3 / 2 }}>
                        <Text
                          style={[
                            LeaveStyle.LeaveBodyText,
                            {
                              fontSize: moderateScale(12),
                              fontFamily: "Century-Gothic",
                            },
                          ]}
                        >
                          {moment(data?.evaluationDate).format("Do, MMM YYYY")}
                        </Text>
                      </View>
                      <View>
                        <Image
                          source={require("../assets/Images/dots.png")}
                          style={{
                            width: moderateScale(20),
                            height: moderateScale(20),
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </Animatable.View>
                ))
              : null}

            {evaluationData?.length >= limit ? (
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

const EvaluationMainStyle = StyleSheet.create({
  titleContainer: {},
});
