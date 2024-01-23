import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MemberStyle from "../styles/MemberStyle.scss";
import { moderateScale } from "../ Metrics";
import { useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";
import { useState } from "react";
import MeetingStyle from "../styles/MeetingStyle.scss";
import moment from "moment";
import { COLORS } from "../color";

export default function MeetingDetail() {
  const navigate = useNavigate();
  const [showMember, setShowMember] = useState(true);
  const [showDicision, setShowDicision] = useState(false);
  return (
    <View
      style={[
        MemberStyle.MemberContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
        },
      ]}
    >
      <View style={MemberStyle.MemberBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/meeting")}
          style={[MemberStyle.MemberBackButton, { padding: moderateScale(15) }]}
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
              MemberStyle.MemberBackButtonTitle,
              { fontSize: moderateScale(14) },
            ]}
          >
            Meeting Detail
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            navigate("/meeting");
          }}
          style={[
            MeetingStyle.MeetingRequestButton,
            {
              paddingVertical: moderateScale(8),
              paddingHorizontal: moderateScale(10),
              borderRadius: moderateScale(10),
              marginRight: moderateScale(10),
            },
          ]}
        >
          <Text
            style={[MeetingStyle.MeetingNext, { fontSize: moderateScale(12) }]}
          >
            Done
          </Text>
        </TouchableOpacity> */}
      </View>
      <Animatable.View
        animation={"fadeInUp"}
        style={MemberStyle.MemberBodyContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            width: "90%",
            marginTop: moderateScale(20),
          }}
        >
          <Text
            style={{
              fontFamily: "Century-Gothic",
              fontSize: moderateScale(14),
            }}
          >
            សូមគោរពអញ្ជើញលោកជំទាវ ចាប់ រាវុត
          </Text>
          <View style={MemberStyles.rowContainer}>
            <Text style={MemberStyles.rowTitle}>Date</Text>
            <Text style={MemberStyles.rowMark}>៖</Text>
            <Text style={MemberStyles.rowTitle}>
              {moment(new Date()).format("DD MMM YYYY")}
            </Text>
          </View>
          <View style={MemberStyles.rowContainer}>
            <Text style={MemberStyles.rowTitle}>Chairman</Text>
            <Text style={MemberStyles.rowMark}>៖</Text>
            <Text style={MemberStyles.rowTitle}>Loklundy</Text>
          </View>
          <View style={MemberStyles.rowContainer}>
            <Text style={MemberStyles.rowTitle}>Vanue</Text>
            <Text style={MemberStyles.rowMark}>៖</Text>
            <Text style={MemberStyles.rowTitle}>A8</Text>
          </View>
          <View style={MemberStyles.rowContainer}>
            <Text style={MemberStyles.rowTitle}>Time</Text>
            <Text style={MemberStyles.rowMark}>៖</Text>
            <Text style={MemberStyles.rowTitle}>12:00 - 13:00</Text>
          </View>
          <View style={MemberStyles.rowContainer}>
            <Text style={MemberStyles.rowTitle}>Remark</Text>
            <Text style={MemberStyles.rowMark}>៖</Text>
            <Text style={MemberStyles.rowTitle}> </Text>
          </View>
          <View style={MemberStyles.cardContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowDicision(false);
                setShowMember(true);
              }}
            >
              <Text style={MemberStyles.cardTitle}>Member</Text>
            </TouchableOpacity>
            <View style={MemberStyles.pillarMember} />
            <TouchableOpacity
              onPress={() => {
                setShowDicision(true);
                setShowMember(false);
              }}
            >
              <Text style={MemberStyles.cardBody}>Dicisions</Text>
            </TouchableOpacity>
          </View>
          {showMember && !showDicision ? (
            [...Array(10)].map((i: any, index: number) => (
              <View style={MemberStyles.memberRowContainer} key={index}>
                <Text style={MemberStyles.memberTitle}>Theang Rathana</Text>
                <Text style={MemberStyles.memberTitleStatus}>Late</Text>
              </View>
            ))
          ) : (
            <Text>Dicisions</Text>
          )}
        </ScrollView>
      </Animatable.View>
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
    backgroundColor: COLORS.BLUE_LIGHT,
    padding: moderateScale(10),
    flexDirection: "row",
    marginVertical: moderateScale(20),
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
    borderBottomWidth: moderateScale(0.5),
    borderColor: "#dcdcdc",
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
