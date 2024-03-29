import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocation, useNavigate } from "react-router-native";
import HomeStyle from "../styles/HomeStyle.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_EMPLOYEEONHOLIDAY } from "../graphql/GetEmployeeOnHoliday";
import * as Animatable from "react-native-animatable";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";

const Features = [
  {
    title: "Leaves",
    icon: require("../assets/Images/blogger.png"),
  },
  {
    title: "Check-In/Out",
    icon: require("../assets/Images/completed-task.png"),
  },
  {
    title: "Attendances",
    icon: require("../assets/Images/check-list.png"),
  },
  {
    title: "Reports",
    icon: require("../assets/Images/file1.png"),
  },
  // {
  //   title: "Meetings",
  //   icon: require("../assets/Images/conversation.png"),
  // },
];

export default function HomeMainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const leaves = Array.from({ length: 20 }, (_, index) => index);
  const { dimension } = useContext(AuthContext);
  const [holiData, setHolidata] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 500);
  }, []);

  const { refetch: HoliRefetch } = useQuery(GET_EMPLOYEEONHOLIDAY, {
    pollInterval: 2000,
    onCompleted(GetEmployeeOnHoliday) {
      setHolidata(GetEmployeeOnHoliday?.getEmployeeOnHoliday);
      // console.log(holiData);
    },
    onError(error) {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    HoliRefetch();
  }, [location.pathname]);

  return (
    <View
      style={[
        HomeStyle.HomeMainContentContainer,
        {
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
        },
      ]}
    >
      <View style={HomeStyle.HomeFeaturesTitle}>
        <Text
          style={[
            HomeStyle.HomeFeaturesTitleText,
            {
              padding: moderateScale(15),
              fontSize: moderateScale(14),
              textDecorationLine: "underline",
              textDecorationStyle: "solid",
            },
          ]}
        >
          FEATURES
        </Text>
      </View>
      <View
        style={[
          HomeStyle.HomeFeaturesBoxesContaienr,
          { height: moderateScale(100), width: "100%" },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ justifyContent: "center" }}
          style={{
            flex: 1,
            width: "100%",
            // paddingLeft: moderateScale(5),
          }}
        >
          {Features.map((feature: any, index: number) => (
            <TouchableOpacity
              onPress={() => {
                if (feature.title === "Leaves") {
                  navigate("/leave");
                } else if (feature.title === "Check-In/Out") {
                  navigate("/check");
                } else if (feature.title === "Attendances") {
                  navigate("/attendance");
                } else if (feature.title === "Reports") {
                  navigate("/report");
                } else if (feature.title === "Meetings") {
                  navigate("/meeting");
                }
              }}
              // activeOpacity={1}
              style={[
                HomeStyle.HomeFeaturesBoxContaienr,
                { height: moderateScale(100), width: moderateScale(100) },
              ]}
              key={index}
            >
              <View
                style={[
                  HomeStyle.HomeBoxStyle,
                  HomeMainStyle.shadow,
                  {
                    width: moderateScale(90),
                    height: moderateScale(85),
                    borderRadius: moderateScale(10),
                  },
                ]}
              >
                <Animatable.Image
                  animation={"bounce"}
                  source={feature.icon}
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                />
                <Text
                  style={[
                    HomeStyle.HomeFeaturesBoxTitle,
                    { fontSize: moderateScale(10) },
                  ]}
                >
                  {feature.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          HomeStyle.HomeLeaveRequestContainer,
          HomeMainStyle.shadow,
          {
            padding: moderateScale(10),
            borderRadius: moderateScale(10),
            marginBottom: moderateScale(10),
          },
        ]}
        onPress={() => navigate("/home/leave")}
      >
        <Text
          style={[
            HomeStyle.HomeLeaveRequestText,

            { fontSize: moderateScale(14) },
          ]}
        >
          REQUEST LEAVE
        </Text>
      </TouchableOpacity>
      <View
        style={[
          HomeMainStyle.shadow,
          {
            flex: 1,
            width: "95%",
            backgroundColor: "#fff",
            borderRadius: moderateScale(15),
            marginBottom: moderateScale(10),
            // borderWidth: moderateScale(1),
            // borderColor: "#dcdcdc",
            padding: moderateScale(5),
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%",
          }}
        >
          <View
            style={[
              HomeStyle.HomeHolidayTopContainer,
              { padding: moderateScale(15) },
            ]}
          >
            <Text
              style={[
                HomeStyle.HomeFeaturesTitleText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Employees on holiday
            </Text>
          </View>

          {holiData.length !== 0
            ? holiData?.map((leave: any, index: number) => (
                <Animatable.View
                  animation={load ? "fadeInUp" : "fadeInUp"}
                  style={[
                    HomeStyle.HomeHolidayCardContainer,
                    { padding: moderateScale(10) },
                  ]}
                  key={index}
                >
                  <Animatable.Image
                    animation={"fadeIn"}
                    source={
                      leave?.profileImage
                        ? { uri: leave?.profileImage }
                        : require("../assets/Images/user.png")
                    }
                    style={[
                      HomeStyle.HomeHolidayProfileImage,
                      {
                        width: moderateScale(40),
                        height: moderateScale(40),
                        marginRight: moderateScale(10),
                        borderWidth: moderateScale(1),
                      },
                    ]}
                  />
                  <View style={HomeStyle.HomeHolidayTitleContainer}>
                    <Text
                      style={[
                        HomeStyle.HomeHolidayTitle1,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {leave?.latinName}
                    </Text>
                    <Text
                      style={[
                        HomeStyle.HomeHolidayTitle3,
                        { fontSize: moderateScale(12) },
                      ]}
                      numberOfLines={1}
                    >
                      {leave?.reason}
                    </Text>
                  </View>
                  <View style={HomeStyle.HomeHolidayTitleLeftContainer}>
                    <View
                      style={[
                        HomeStyle.HomeBoxShift,
                        {
                          paddingHorizontal: moderateScale(6),
                          paddingVertical: moderateScale(1),
                          borderRadius: moderateScale(4),
                          height: moderateScale(14),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          HomeStyle.HomeBoxText,
                          { fontSize: moderateScale(8) },
                        ]}
                      >
                        {leave?.timeOff}
                      </Text>
                    </View>
                    <Text
                      style={[
                        HomeStyle.HomeHolidayTitle2,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      {leave?.dateLeave ? leave?.dateLeave : ""}
                    </Text>
                  </View>
                </Animatable.View>
              ))
            : null}
        </ScrollView>
      </View>
    </View>
  );
}

const HomeMainStyle = StyleSheet.create({
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
