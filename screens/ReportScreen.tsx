import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReportStyle from "../styles/ReportStyle.scss";
import { useLocation, useNavigate } from "react-router-native";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import SwiperPage from "../includes/SwiperPage";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";

const Reports = [
  {
    title: "Daily Attendance",
    description: "The specific day for which the attendance is being recorded.",
    icon: require("../assets/Images/attendance.png"),
  },
  {
    title: "Evaluation Report",
    description:
      "A detailed analysis of employee performance, highlighting strengths, areas for improvement, and overall contributions to the organization.",
    icon: require("../assets/Images/valuation.png"),
  },
];

export default function ReportScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const { dimension } = useContext(AuthContext);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    setIsScrolling(false);
  };
  return (
    <View
      style={[
        ReportStyle.ReportContainer,
        {
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
        },
      ]}
    >
      <SwiperPage path={"/home"} page="report" isScrolling={isScrolling}>
        <View style={ReportStyle.ReportBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={[
              ReportStyle.ReportBackButton,
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
                ReportStyle.ReportBackButtonTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              REPORTS
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {Reports.map((data: any, index: number) => (
            <View
              key={index}
              style={[
                ReportStyle.ReportBodyContainer,
                { marginVertical: moderateScale(10) },
              ]}
            >
              <TouchableOpacity
                style={[
                  ReportMainStyle.shadow,
                  ReportStyle.ReportCardContainer,
                  {
                    borderRadius: moderateScale(10),
                    padding: moderateScale(10),
                  },
                ]}
                onPress={() => {
                  if (data.title === "Daily Attendance") {
                    navigate("/report/daily-attendace");
                  } else if (data.title === "Evaluation Report") {
                    navigate("/report/valuation-report");
                  }
                }}
              >
                <View
                  style={[
                    ReportStyle.ReportIcon,
                    {
                      width: moderateScale(60),
                      height: moderateScale(60),
                      borderRadius: moderateScale(10),
                      // borderWidth: moderateScale(1),
                      // borderColor: "#dcdcdc",
                    },
                  ]}
                >
                  <Image
                    source={data?.icon}
                    style={[
                      {
                        width: moderateScale(45),
                        height: moderateScale(45),
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    ReportStyle.TitleContainer,
                    { paddingHorizontal: moderateScale(10) },
                  ]}
                >
                  <Text
                    style={[
                      ReportStyle.TitleAtt,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {data.title}
                  </Text>
                  <Text
                    style={[
                      ReportStyle.ReasonAtt,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {data.description}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SwiperPage>
    </View>
  );
}

const ReportMainStyle = StyleSheet.create({
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
