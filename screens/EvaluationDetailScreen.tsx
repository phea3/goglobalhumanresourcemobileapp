import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MemberStyle from "../styles/MemberStyle.scss";
import { moderateScale } from "../ Metrics";
import { useLocation, useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";
import { useContext, useEffect, useState } from "react";
import MeetingStyle from "../styles/MeetingStyle.scss";
import moment from "moment";
import { COLORS } from "../color";
import { useQuery } from "@apollo/client";
import { GETEVALUATIOINDETAILFORMOBILE } from "../graphql/GetEvaluationDetailForMobile";
import SwiperPage from "../includes/SwiperPage";
import LeaveStyle from "../styles/LeaveStyle.scss";
import { AuthContext } from "../Context/AuthContext";

export default function EvaluationDetailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;
  const { widthScreen } = useContext(AuthContext);
  const [evaluationDetail, getEvaluationDatail] = useState<any>();
  const { refetch } = useQuery(GETEVALUATIOINDETAILFORMOBILE, {
    variables: {
      id: id,
    },
    onCompleted: ({ getEvaluationDetailForMobile }) => {
      getEvaluationDatail(getEvaluationDetailForMobile);
    },
  });

  useEffect(() => {
    refetch();
    // console.log(evaluationDetail);
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
        },
      ]}
    >
      <SwiperPage
        path={"/report/valuation-report"}
        page="leave"
        isScrolling={isScrolling}
      >
        <View style={{ width: Platform.OS === "ios" ? "100%" : widthScreen }}>
          <TouchableOpacity
            onPress={() => navigate("/report/valuation-report")}
            style={[
              MemberStyle.MemberBackButton,
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
              Avaluation Detail
            </Text>
          </TouchableOpacity>
        </View>

        <Animatable.View
          animation={"fadeInUp"}
          style={MemberStyle.MemberBodyContainer}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              width: "95%",
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: moderateScale(10),
              }}
            >
              <Text
                style={{
                  fontFamily: "Century-Gothic-Bold",
                  fontSize: moderateScale(16),
                }}
              >
                {evaluationDetail?.evaluationTitle
                  ? evaluationDetail?.evaluationTitle
                  : "--:--"}
              </Text>
            </View>

            <View style={MemberStyles.rowContainer}>
              <Text style={MemberStyles.rowTitleMain}>Date</Text>
              <Text style={MemberStyles.rowMark}>៖</Text>
              <Text style={MemberStyles.rowTitle}>
                {evaluationDetail?.evaluationDate
                  ? moment(new Date()).format("DD MMM YYYY")
                  : "--:--"}
              </Text>
            </View>
            <View style={MemberStyles.rowContainer}>
              <Text style={MemberStyles.rowTitleMain}>Employee</Text>
              <Text style={MemberStyles.rowMark}>៖</Text>
              <Text style={MemberStyles.rowTitle}>
                {evaluationDetail?.employeeName
                  ? evaluationDetail?.employeeName
                  : "--:--"}
              </Text>
            </View>
            <View style={MemberStyles.rowContainer}>
              <Text style={MemberStyles.rowTitleMain}>Position</Text>
              <Text style={MemberStyles.rowMark}>៖</Text>
              <Text style={MemberStyles.rowTitle}>
                {evaluationDetail?.position
                  ? evaluationDetail?.position
                  : "--:--"}
              </Text>
            </View>
            <View style={MemberStyles.rowContainer}>
              <Text style={MemberStyles.rowTitleMain}>Deparment</Text>
              <Text style={MemberStyles.rowMark}>៖</Text>
              <Text style={MemberStyles.rowTitle}>
                {evaluationDetail?.department
                  ? evaluationDetail?.department
                  : "--:--"}
              </Text>
            </View>

            {evaluationDetail?.evaluationDetailList ? (
              evaluationDetail?.evaluationDetailList.map(
                (i: any, index: number) => (
                  <View key={index}>
                    <View style={MemberStyles.cardContainer}>
                      <View>
                        <Text style={MemberStyles.cardTitle}>
                          {i?.evaluation}
                        </Text>
                      </View>
                    </View>
                    <View style={MemberStyles.memberRowContainer}>
                      <Text style={MemberStyles.memberTitle}>{i?.result}</Text>
                      <Text style={MemberStyles.memberTitleStatus}></Text>
                    </View>
                  </View>
                )
              )
            ) : (
              <Text>Dicisions</Text>
            )}
          </ScrollView>
        </Animatable.View>
      </SwiperPage>
    </View>
  );
}

const MemberStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    width: "60%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTitleMain: {
    fontFamily: "Century-Gothic-Bold",
    fontSize: moderateScale(14),
    width: "45%",
    textAlign: "left",
  },
  rowTitle: {
    fontFamily: "Century-Gothic",
    fontSize: moderateScale(14),
    width: "45%",
    textAlign: "left",
  },
  rowMark: {
    fontFamily: "Century-Gothic",
    fontSize: moderateScale(14),
    width: "10%",
    textAlign: "left",
  },
  cardContainer: {
    width: "100%",
    backgroundColor: COLORS.BLUE_SUPER_LIGHT,
    padding: moderateScale(10),
    flexDirection: "row",
    marginTop: moderateScale(10),
  },
  pillarMember: {
    width: 2,
    backgroundColor: COLORS.DARK,
    marginHorizontal: moderateScale(10),
  },
  cardTitle: {
    fontFamily: "Century-Gothic-Bold",
    fontSize: moderateScale(14),
    textAlign: "left",
    color: "#082b9e",
  },
  cardBody: {
    fontFamily: "Century-Gothic",
    fontSize: moderateScale(14),
    textAlign: "left",
  },
  memberRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: moderateScale(10),
  },
  memberTitle: {
    fontFamily: "Century-Gothic",
    fontSize: moderateScale(12),
    textAlign: "left",
  },
  memberTitleStatus: {
    fontFamily: "Century-Gothic-Bold",
    fontSize: moderateScale(12),
    textAlign: "left",
    color: COLORS.RED,
  },
});
