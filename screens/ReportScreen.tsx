import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReportStyle from "../styles/ReportStyle.scss";
import { useLocation, useNavigate } from "react-router-native";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import SwiperPage from "../includes/SwiperPage";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";

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
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
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
          <View
            style={[
              ReportStyle.ReportBodyContainer,
              { marginTop: moderateScale(10) },
            ]}
          >
            <TouchableOpacity
              style={[
                ReportStyle.ReportCardContainer,
                { borderRadius: moderateScale(10), padding: moderateScale(10) },
              ]}
              onPress={() => navigate("/report/daily-attendace")}
            >
              <View
                style={[
                  ReportStyle.ReportIcon,
                  {
                    width: moderateScale(60),
                    height: moderateScale(60),
                    borderRadius: moderateScale(10),
                  },
                ]}
              >
                <Image
                  source={require("../assets/Images/attendance.png")}
                  style={[
                    { width: moderateScale(45), height: moderateScale(45) },
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
                  Daily Attendance
                </Text>
                <Text
                  style={[
                    ReportStyle.ReasonAtt,
                    { fontSize: moderateScale(12) },
                  ]}
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
