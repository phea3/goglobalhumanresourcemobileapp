import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MemberStyle from "../styles/MemberStyle.scss";
import { moderateScale } from "../ Metrics";
import { useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import MeetingStyle from "../styles/MeetingStyle.scss";

export default function MemberScreen() {
  const navigate = useNavigate();
  const [isChecked, setChecked] = useState(true);
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
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
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
            width: "90%",
            marginTop: moderateScale(20),
          }}
        >
          <TouchableOpacity
            onPress={() => setChecked(!isChecked)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: moderateScale(10),
            }}
          >
            <Checkbox
              style={[
                {
                  height: moderateScale(25),
                  width: moderateScale(25),
                  marginRight: moderateScale(10),
                },
              ]}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#3C6EFB" : "#3C6EFB"}
            />
            <Text>English name</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </View>
  );
}
