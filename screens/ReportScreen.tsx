import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReportStyle from "../styles/ReportStyle.scss";
import { useLocation, useNavigate } from "react-router-native";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import SwiperPage from "../includes/SwiperPage";

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
    <View style={ReportStyle.ReportContainer}>
      <SwiperPage path={"/home"} page="report" isScrolling={isScrolling}>
        <View style={ReportStyle.ReportBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={
              dimension === "sm"
                ? ReportStyle.ReportBackButtonSM
                : ReportStyle.ReportBackButton
            }
          >
            <Image
              source={require("../assets/Images/back-dark-blue.png")}
              style={
                dimension === "sm"
                  ? ReportStyle.ReportBackButtonIconSM
                  : ReportStyle.ReportBackButtonIcon
              }
            />
            <Text
              style={
                dimension === "sm"
                  ? ReportStyle.ReportBackButtonTitleSM
                  : ReportStyle.ReportBackButtonTitle
              }
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
        >
          <View style={ReportStyle.ReportBodyContainer}>
            <TouchableOpacity
              style={ReportStyle.ReportCardContainer}
              onPress={() => navigate("/report/daily-attendace")}
            >
              <View
                style={
                  dimension === "sm"
                    ? ReportStyle.ReportIconSM
                    : ReportStyle.ReportIcon
                }
              >
                <Image
                  source={require("../assets/Images/attendance.png")}
                  style={
                    dimension === "sm"
                      ? ReportStyle.ImageIconSM
                      : ReportStyle.ImageIcon
                  }
                />
              </View>
              <View style={ReportStyle.TitleContainer}>
                <Text
                  style={
                    dimension === "sm"
                      ? ReportStyle.TitleAttSM
                      : ReportStyle.TitleAtt
                  }
                >
                  Daily Attendance
                </Text>
                <Text
                  style={
                    dimension === "sm"
                      ? ReportStyle.ReasonAttSM
                      : ReportStyle.ReasonAtt
                  }
                >
                  The specific day for which the attendance is being recorded.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SwiperPage>
    </View>
  );
}
