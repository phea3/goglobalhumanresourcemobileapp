import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigate } from "react-router-native";
import { useContext, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import DailyAttendanceStyle from "../styles/DailyAttendanceStyle.scss";
import HomeStyle from "../styles/HomeStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import moment from "moment";

export default function DailyAttendance() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [dateIsvisble, setDateIsvisible] = useState(false);
  const [date, setDate] = useState(new Date());

  const hidDatePicker = () => {
    setDateIsvisible(false);
  };
  const showDatePicker = () => {
    setDateIsvisible(true);
  };
  const handConfirm = (selectedDate: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      hidDatePicker();
    }
  };

  return (
    <View style={DailyAttendanceStyle.DailyAttContainer}>
      <View style={DailyAttendanceStyle.DailyAttBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/report")}
          style={
            dimension === "sm"
              ? DailyAttendanceStyle.DailyAttBackButtonSM
              : DailyAttendanceStyle.DailyAttBackButton
          }
        >
          <Image
            source={require("../assets/Images/back-dark-blue.png")}
            style={
              dimension === "sm"
                ? DailyAttendanceStyle.DailyAttBackButtonIconSM
                : DailyAttendanceStyle.DailyAttBackButtonIcon
            }
          />
          <Text
            style={
              dimension === "sm"
                ? DailyAttendanceStyle.DailyAttBackButtonTitleSM
                : DailyAttendanceStyle.DailyAttBackButtonTitle
            }
          >
            Daily Attendance
          </Text>
        </TouchableOpacity>
      </View>
      <View style={DailyAttendanceStyle.DailyAttBodyContainer}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={DailyAttendanceStyle.DailyAttBodyContainer}>
            <View style={DailyAttendanceStyle.CheckMainSelectDateSection}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    DailyAttendanceStyle.CheckMainSelectDateButton,
                    {
                      marginRight: 10,
                    },
                  ]}
                  onPress={() => {
                    setMorning(true);
                    setAfternoon(false);
                  }}
                >
                  <Image
                    source={
                      morning
                        ? require("../assets/Images/rec.png")
                        : require("../assets/Images/reced.png")
                    }
                    style={[
                      dimension === "sm"
                        ? DailyAttendanceStyle.DailyAttMainSelectIconSM
                        : DailyAttendanceStyle.DailyAttMainSelectIcon,
                      { marginRight: 10 },
                    ]}
                  />
                  <Text
                    style={
                      dimension === "sm"
                        ? DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholderSM
                        : DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder
                    }
                  >
                    Morning
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={DailyAttendanceStyle.CheckMainSelectDateButton}
                  onPress={() => {
                    setMorning(false);
                    setAfternoon(true);
                  }}
                >
                  <Image
                    source={
                      afternoon
                        ? require("../assets/Images/rec.png")
                        : require("../assets/Images/reced.png")
                    }
                    style={[
                      dimension === "sm"
                        ? DailyAttendanceStyle.DailyAttMainSelectIconSM
                        : DailyAttendanceStyle.DailyAttMainSelectIcon,
                      { marginRight: 10 },
                    ]}
                  />
                  <Text
                    style={
                      dimension === "sm"
                        ? DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholderSM
                        : DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder
                    }
                  >
                    Afternoon
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={
                  dimension === "sm"
                    ? DailyAttendanceStyle.DailyAttMainSelectDateButtonSM
                    : DailyAttendanceStyle.DailyAttMainSelectDateButton
                }
              >
                <Image
                  source={require("../assets/Images/calendar.png")}
                  style={[
                    dimension === "sm"
                      ? DailyAttendanceStyle.DailyAttMainSelectIconSM
                      : DailyAttendanceStyle.DailyAttMainSelectIcon,
                    { marginRight: 10 },
                  ]}
                />
                <View
                  style={DailyAttendanceStyle.DailyAttMainMainSelectDateSection}
                >
                  <TouchableOpacity onPress={showDatePicker}>
                    <Text
                      style={
                        dimension === "sm"
                          ? DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholderSM
                          : DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder
                      }
                    >
                      {moment(date).format("DD-MM-YYYY")}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={dateIsvisble}
                    mode="date"
                    onConfirm={handConfirm}
                    onCancel={hidDatePicker}
                  />
                </View>
              </View>

              <View style={DailyAttendanceStyle.DailyAttCardContainer}>
                <View style={DailyAttendanceStyle.DailyAttCardLeft}>
                  <Image source={require("../assets/Images/user_phoem.jpg")} />
                </View>
                <View style={DailyAttendanceStyle.DailyAttCardRight}></View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
