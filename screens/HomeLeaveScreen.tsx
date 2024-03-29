import {
  Alert,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import HomeStyle from "../styles/HomeStyle.scss";
import LeaveStyle from "../styles/LeaveStyle.scss";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import { AuthContext } from "../Context/AuthContext";
import { useMutation, useQuery } from "@apollo/client";
import { REQUEST_LEAVE } from "../graphql/RequestLeave";
import { GETTIMEOFFSFORMOBILE } from "../graphql/GetTimeOffsForMobile";
import KeyboardDismissableArea from "../functions/KeyboardDismissableArea";
import { moderateScale } from "../ Metrics";

export default function HomeLeaveScreen() {
  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allDay, setAllDay] = useState(true);
  const [halfDay, setHalfDay] = useState(false);
  const [dateIsvisble, setDateIsvisible] = useState(false);
  const [dateIsvisble2, setDateIsvisible2] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeOff, setTimeOff] = useState([]);
  const [timeId, setTimeId] = useState("");
  const [reason, setReason] = useState("");
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [defaultTimeoff, setDefaultTimeoff] = useState("");
  const [defaultTimeoffId, setDefaultTimeoffId] = useState("");

  const hidDatePicker = () => {
    setDateIsvisible(false);
  };

  const hidDatePicker2 = () => {
    setDateIsvisible2(false);
  };

  const showDatePicker = () => {
    setDateIsvisible(true);
  };

  const showDatePicker2 = () => {
    setDateIsvisible2(true);
  };

  const handConfirm = (selectedDate: Date) => {
    if (selectedDate) {
      setStartDate(selectedDate);
      hidDatePicker();
    }
  };

  const handConfirm2 = (selectedDate2: Date) => {
    if (selectedDate2) {
      setEndDate(selectedDate2);
      hidDatePicker2();
    }
  };

  const { data: TimeDate, refetch: TimeRefetch } = useQuery(
    GETTIMEOFFSFORMOBILE,
    {
      pollInterval: 2000,
      onCompleted(data) {
        setTimeOff(TimeDate?.getTimeOffsForMobile);
      },
      onError(error) {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    TimeRefetch();
  }, []);

  useEffect(() => {
    setDefaultTimeoff(
      TimeDate?.getTimeOffsForMobile
        ? TimeDate?.getTimeOffsForMobile[0]?.timeOff
        : ""
    );
    setDefaultTimeoffId(
      TimeDate?.getTimeOffsForMobile
        ? TimeDate?.getTimeOffsForMobile[0]?._id
        : ""
    );
    console.log(defaultTimeoff, defaultTimeoffId);
  }, [TimeDate]);

  const [requestLeave] = useMutation(REQUEST_LEAVE);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlRequest = async () => {
    if (isButtonDisabled) {
      return;
    }
    setIsButtonDisabled(true);

    const newValues = {
      from: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      reason: reason ? reason : "",
      shiftOff: allDay
        ? "AllDay"
        : morning
        ? "Morning"
        : afternoon
        ? "Afternoon"
        : "",
      timeOff: timeId ? timeId : defaultTimeoffId,
      to:
        allDay === true && endDate
          ? moment(endDate).format("YYYY-MM-DD")
          : startDate
          ? moment(startDate).format("YYYY-MM-DD")
          : "",
    };
    try {
      await requestLeave({
        variables: { input: newValues },
        onCompleted: ({ requestLeave }) => {
          Alert.alert(
            requestLeave?.status ? "Success!" : "Oops!",
            requestLeave?.message,
            [
              {
                text: "Okay",
                onPress: () => {
                  if (requestLeave?.status === true) {
                    navigate("/leave");
                  }
                },
                style: "cancel",
              },
            ]
          );
        },
        onError(error) {
          Alert.alert("Oops!", error?.message);
        },
      });
    } catch (error) {
      console.error("Mutation error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
        HomeStyle.HomeMainContentContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
        },
      ]}
    >
      <View style={HomeStyle.HomeFeaturesTitle}>
        <TouchableOpacity
          style={[
            HomeStyle.HomeFeaturesTitleButton,
            { padding: moderateScale(15) },
          ]}
          onPress={() => navigate("/home/main")}
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
            Main Leave
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={[
          HomeLeaveStyle.shadow,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f8f8",
            borderRadius: moderateScale(10),
            padding: moderateScale(10),
            marginHorizontal: moderateScale(15),
          },
        ]}
        style={HomeStyle.HomeMainScrollviewStyle}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        <KeyboardDismissableArea />
        {!isKeyboardVisible ? (
          <>
            <View
              style={[
                HomeStyle.HomeMainSelectDateButtonLabelContainer,
                { height: moderateScale(40) },
              ]}
            >
              <Text
                style={[
                  HomeStyle.HomeMainSelectDateButtonLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Select Shift
              </Text>
            </View>
            <View
              style={[
                HomeStyle.HomeMainSelectTimeContainer,
                { height: moderateScale(40), paddingTop: moderateScale(10) },
              ]}
            >
              <TouchableOpacity
                style={[
                  HomeStyle.HomeMainSelectTimeHalfContainer,
                  { marginRight: 10 },
                ]}
                onPress={() => {
                  setAllDay(true), setHalfDay(false);
                }}
              >
                <Image
                  source={
                    allDay
                      ? require("../assets/Images/rec.png")
                      : require("../assets/Images/reced.png")
                  }
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                    marginRight: moderateScale(10),
                  }}
                />
                <Text
                  style={[
                    HomeStyle.HomeMainSelectTitle,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  All Day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={HomeStyle.HomeMainSelectTimeHalfContainer}
                onPress={() => {
                  setAllDay(false), setHalfDay(true);
                }}
              >
                <Image
                  source={
                    halfDay
                      ? require("../assets/Images/rec.png")
                      : require("../assets/Images/reced.png")
                  }
                  style={{
                    width: moderateScale(20),
                    height: moderateScale(20),
                    marginRight: moderateScale(10),
                  }}
                />
                <Text
                  style={[
                    HomeStyle.HomeMainSelectTitle,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Half Day
                </Text>
              </TouchableOpacity>
            </View>
            <View style={HomeStyle.HomeMainSelectDateContainer}>
              <View
                style={[
                  HomeStyle.HomeMainSelectDateMiniContainer,
                  { marginRight: moderateScale(10) },
                ]}
              >
                <View
                  style={[
                    HomeStyle.HomeMainSelectDateButtonLabelContainer,
                    { height: moderateScale(40) },
                  ]}
                >
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectDateButtonLabel,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {allDay ? "Start Date" : "Date"}
                  </Text>
                </View>

                <View
                  style={[
                    HomeStyle.HomeMainSelectDateButton,
                    {
                      height: moderateScale(40),
                      paddingHorizontal: moderateScale(10),
                      borderRadius: moderateScale(10),
                    },
                  ]}
                >
                  <Image
                    source={require("../assets/Images/calendar.png")}
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <View style={HomeStyle.HomeMainSelectDateSection}>
                    <TouchableOpacity onPress={showDatePicker}>
                      <Text
                        style={[
                          HomeStyle.HomeMainSelectDateButtonPlaceholder,
                          { fontSize: moderateScale(12) },
                        ]}
                      >
                        {moment(startDate).format("DD-MM-YYYY")}
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
              </View>
              <View style={HomeStyle.HomeMainSelectDateMiniContainer}>
                <View
                  style={[
                    HomeStyle.HomeMainSelectDateButtonLabelContainer,
                    { height: moderateScale(40) },
                  ]}
                >
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectDateButtonLabel,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    {halfDay ? "Request For" : "End Date"}
                  </Text>
                </View>

                {halfDay ? (
                  <View
                    style={
                      dimension === "sm" || Platform.OS === "android"
                        ? HomeStyle.HomeMainSelectDateSectionSM
                        : HomeStyle.HomeMainSelectDateSection
                    }
                  >
                    <TouchableOpacity
                      style={[
                        HomeStyle.HomeMainSelectDateButton,
                        {
                          height: moderateScale(40),
                          paddingHorizontal: moderateScale(10),
                          borderRadius: moderateScale(10),
                          marginRight: moderateScale(10),
                          marginBottom:
                            dimension === "sm" || Platform.OS === "android"
                              ? moderateScale(10)
                              : 0,
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
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeMainSelectDateButtonPlaceholder,
                          { fontSize: moderateScale(12) },
                        ]}
                      >
                        Morning
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        HomeStyle.HomeMainSelectDateButton,
                        {
                          height: moderateScale(40),
                          paddingHorizontal: moderateScale(10),
                          borderRadius: moderateScale(10),
                          marginBottom:
                            dimension === "sm" || Platform.OS === "android"
                              ? moderateScale(10)
                              : 0,
                        },
                      ]}
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
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <Text
                        style={[
                          HomeStyle.HomeMainSelectDateButtonPlaceholder,
                          { fontSize: moderateScale(12) },
                        ]}
                      >
                        Afternoon
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={[
                      HomeStyle.HomeMainSelectDateButton,
                      {
                        height: moderateScale(40),
                        paddingHorizontal: moderateScale(10),
                        borderRadius: moderateScale(10),
                      },
                    ]}
                  >
                    <Image
                      source={require("../assets/Images/calendar.png")}
                      style={{
                        width: moderateScale(20),
                        height: moderateScale(20),
                        marginRight: moderateScale(10),
                      }}
                    />
                    <TouchableOpacity onPress={showDatePicker2}>
                      <Text
                        style={[
                          HomeStyle.HomeMainSelectDateButtonPlaceholder,
                          { fontSize: moderateScale(12) },
                        ]}
                      >
                        {moment(endDate).format("DD-MM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={dateIsvisble2}
                      mode="date"
                      onConfirm={handConfirm2}
                      onCancel={hidDatePicker2}
                    />
                  </View>
                )}
              </View>
            </View>
          </>
        ) : null}
        <View
          style={[
            HomeStyle.HomeMainSelectDateButtonLabelContainer,
            { height: moderateScale(40) },
          ]}
        >
          <Text
            style={[
              HomeStyle.HomeMainSelectDateButtonLabel,
              { fontSize: moderateScale(14) },
            ]}
          >
            Type Time Off
          </Text>
        </View>
        {timeOff && timeOff.length === 0 ? (
          <View style={{ width: "100%" }}>
            <View
              style={{
                width: "100%",
                height: dimension === "sm" ? 30 : 40,
                backgroundColor: "#f8f8f8",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#9aa3a6",
                justifyContent: "center",
                padding: 5,
              }}
            >
              <Text style={{ color: "#9aa3a6" }}>Choose time off</Text>
            </View>
            <Text style={{ color: "#ff0000", padding: 5 }}>
              You don't have time-off, please contact HR!
            </Text>
          </View>
        ) : (
          <SelectDropdown
            data={timeOff}
            onSelect={(selectedItem, index) => {
              // console.log(selectedItem, index);
              setTimeId(selectedItem?._id);
            }}
            renderCustomizedButtonChild={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected
              return (
                <View>
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectDateButtonPlaceholder,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {selectedItem?.timeOff
                      ? selectedItem?.timeOff
                      : defaultTimeoff
                      ? defaultTimeoff
                      : "Choose time off"}
                  </Text>
                </View>
              );
            }}
            dropdownStyle={{
              borderRadius: moderateScale(10),
              paddingHorizontal: moderateScale(10),
            }}
            renderCustomizedRowChild={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return (
                <View>
                  <Text
                    style={[
                      HomeStyle.HomeMainSelectDateButtonPlaceholder,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    {item?.timeOff}
                  </Text>
                </View>
              );
            }}
            buttonStyle={{
              width: "100%",
              height: moderateScale(40),
              backgroundColor: "#f8f8f8",
              borderRadius: moderateScale(10),
              borderWidth: moderateScale(1),
              borderColor: "#082b9e",
            }}
          />
        )}
        {defaultTimeoffId === "" && timeId === "" && (
          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: "#ff0000",
                padding: moderateScale(5),
                fontSize: moderateScale(14),
              }}
            >
              Require!
            </Text>
          </View>
        )}
        <View
          style={[
            HomeStyle.HomeMainSelectDateButtonLabelContainer,
            { height: moderateScale(40) },
          ]}
        >
          <Text
            style={[
              HomeStyle.HomeMainSelectDateButtonLabel,
              { fontSize: moderateScale(14) },
            ]}
          >
            Reason
          </Text>
        </View>
        <View
          style={[
            HomeStyle.HomeLeaveReasonContainer,
            {
              height: moderateScale(40),
              borderWidth: moderateScale(1),
              borderRadius: moderateScale(10),
              paddingLeft: moderateScale(10),
            },
          ]}
        >
          <TextInput
            value={reason}
            placeholder="Reason"
            style={[
              HomeStyle.HomeLeaveReasonStyle,
              { fontSize: moderateScale(12) },
            ]}
            onChangeText={(e) => setReason(e)}
            maxLength={50} // Set the maximum number of characters
            returnKeyType="done"
          />
        </View>
        {reason.length === 0 && (
          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: "#ff0000",
                padding: moderateScale(5),
                fontSize: moderateScale(14),
              }}
            >
              Require!
            </Text>
          </View>
        )}

        <View
          style={[
            HomeStyle.HomeMainSelectDateButtonLabelContainer,
            { height: moderateScale(40) },
          ]}
        >
          <Text
            style={[
              HomeStyle.HomeMainSelectDateButtonLabel,
              { fontSize: moderateScale(14) },
            ]}
          >
            {" "}
          </Text>
        </View>
        {!isKeyboardVisible ? (
          <TouchableOpacity
            disabled={isButtonDisabled}
            activeOpacity={
              reason !== "" && (defaultTimeoffId !== "" || timeId !== "")
                ? 0.4
                : 1
            }
            style={[
              HomeStyle.HomeLeaveRequestButton,
              {
                height: moderateScale(40),
                padding: moderateScale(10),
                marginBottom: moderateScale(10),
                borderRadius: moderateScale(10),
              },
            ]}
            onPress={() => {
              if (reason !== "" && (defaultTimeoffId !== "" || timeId !== "")) {
                handlRequest();
              }
            }}
          >
            <Text
              style={[
                HomeStyle.HomeLeaveRequestButtonText,
                { fontSize: moderateScale(14) },
              ]}
            >
              Request
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}

const HomeLeaveStyle = StyleSheet.create({
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
