import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import { useNavigate } from "react-router-native";
import { useEffect, useState } from "react";
import { moderateScale } from "../ Metrics";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import * as Animatable from "react-native-animatable";
import SwiperPage from "../includes/SwiperPage";
import { useQuery } from "@apollo/client";
import { GETCHAIRMAN } from "../graphql/SelectChairman";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GETMEETINGROOM } from "../graphql/SelectMeetingRoom";

export default function RequestMeetingScreen() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState(new Date());
  const [datetime, setDatetime] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [request, setRequest] = useState(false);
  const [listView, setListView] = useState(true);
  const [requestView, setRequestView] = useState(false);
  const [chairmanId, setChairmanId] = useState("");
  const [chairmanName, setChairmanName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [isDatetimePickerVisible, setDatetimePickerVisibility] =
    useState(false);
  const [meetingRoom, setMeetingRoom] = useState("");
  const [meetingRoomName, setMeetingRoomName] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showStartPicker = () => {
    setStartPickerVisibility(true);
  };

  const showEndPicker = () => {
    setEndPickerVisibility(true);
  };

  const showDatetimePicker = () => {
    setDatetimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const hideStartPicker = () => {
    setStartPickerVisibility(false);
  };

  const hideEndPicker = () => {
    setEndPickerVisibility(false);
  };

  const hideDatetimePicker = () => {
    setDatetimePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date);
    hideDatePicker();
  };

  const handleStart = (start: Date) => {
    setStart(start);
    hideStartPicker();
  };

  const handleEnd = (end: Date) => {
    setEnd(end);
    hideEndPicker();
  };

  const handleDatetime = (dateTime: Date) => {
    setDatetime(dateTime);
    hideDatetimePicker();
  };

  const [chairmanLimit, setChairmanLimit] = useState(250);
  const [chairmans, setChairmans] = useState([]);

  const { data: chairmanData, refetch: chairmanRefetch } = useQuery(
    GETCHAIRMAN,
    {
      pollInterval: 2000,
      variables: {
        limit: chairmanLimit,
      },
      onCompleted: ({ selectChairman }) => {
        setChairmans(
          // console.log("selectChairman: ", selectChairman);
          selectChairman.map(({ _id, value }: any) => ({ _id, value }))
        );
      },
      onError(error) {
        console.log(error?.message);
      },
    }
  );

  useEffect(() => {
    chairmanRefetch();
    // console.log("selectChairman: ", chairmans);
  }, [chairmans]);

  const { data: meetingRoomData, refetch: meetingRoomRefetch } = useQuery(
    GETMEETINGROOM,
    {
      pollInterval: 2000,
      onCompleted: ({ selectMeetingRoom }) => {
        // console.log("selectChairman: ", chairmanData?.selectChairman);
      },
    }
  );

  useEffect(() => {
    meetingRoomRefetch();
  }, []);

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

  useEffect(() => {
    if (!listView && requestView) {
      setTimeout(() => {
        navigate("/meeting");
      }, 1500);
    }
  }, [listView, requestView]);

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

  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
        },
      ]}
    >
      <SwiperPage path={"/home"} page="meeting" isScrolling={isScrolling}>
        <View style={MeetingStyle.MeetingBackButtonContainer}>
          <View
            style={[
              MeetingStyle.MeetingBackButton,
              { padding: moderateScale(15), flex: 1 },
            ]}
          >
            <Text
              style={[
                MeetingStyle.MeetingBackButtonTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              Request Metting
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setListView(!listView);
              setRequestView(!requestView);
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
              style={[
                MeetingStyle.MeetingNext,
                { fontSize: moderateScale(12) },
              ]}
            >
              {"< Back"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate("/member", {
                state: {
                  topic,
                  description,
                  date,
                  start,
                  end,
                  chairmanId,
                  remark,
                  meetingRoom,
                  datetime,
                  meetingRoomName,
                  chairmanName,
                },
              })
            }
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
              style={[
                MeetingStyle.MeetingNext,
                { fontSize: moderateScale(12) },
              ]}
            >
              NEXT {">"}
            </Text>
          </TouchableOpacity>
        </View>
        <Animatable.View
          animation={listView ? "fadeInUp" : "fadeOutDown"}
          style={MeetingStyle.MeetingBodyContainer}
        >
          <View
            style={[
              MeetingStyle.MeetingBartitileBackgroundVisible,
              { width: "95%", height: 1 },
            ]}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                {" "}
              </Text>
            </View>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, width: "90%" }}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
          >
            <View style={{ marginBottom: moderateScale(10) }}>
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Topic
              </Text>
              <View
                style={[
                  MeetingStyle.MeetingTopicContainer,
                  {
                    width: "100%",
                    padding: moderateScale(10),
                    borderWidth: moderateScale(1),
                    borderRadius: moderateScale(10),
                    marginTop: moderateScale(10),
                  },
                ]}
              >
                <TextInput
                  maxLength={50}
                  value={topic}
                  onChangeText={(e) => setTopic(e)}
                  placeholder="Enter Topic"
                  style={[
                    MeetingStyle.MeetingPlaceholder,
                    { width: "100%", fontSize: moderateScale(12) },
                  ]}
                />
              </View>
              {topic === "" ? (
                <Text style={styleScheet.requireText}>require!</Text>
              ) : null}
            </View>
            <View>
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Description
              </Text>
              <View
                style={[
                  MeetingStyle.MeetingTopicContainer,
                  {
                    width: "100%",
                    padding: moderateScale(10),
                    borderWidth: moderateScale(1),
                    borderRadius: moderateScale(10),
                    marginTop: moderateScale(10),
                  },
                ]}
              >
                <TextInput
                  maxLength={50}
                  value={description}
                  onChangeText={(e) => setDescription(e)}
                  placeholder="Description"
                  style={[
                    MeetingStyle.MeetingPlaceholder,
                    { width: "100%", fontSize: moderateScale(12) },
                  ]}
                />
              </View>
              {description === "" ? (
                <Text style={styleScheet.optionalText}>optional!</Text>
              ) : null}
            </View>
            <View style={{ marginTop: moderateScale(10) }}>
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Remark
              </Text>
              <View
                style={[
                  MeetingStyle.MeetingTopicContainer,
                  {
                    width: "100%",
                    padding: moderateScale(10),
                    borderWidth: moderateScale(1),
                    borderRadius: moderateScale(10),
                    marginTop: moderateScale(10),
                  },
                ]}
              >
                <TextInput
                  maxLength={50}
                  value={remark}
                  onChangeText={(e) => setRemark(e)}
                  placeholder="Remark"
                  style={[
                    MeetingStyle.MeetingPlaceholder,
                    { width: "100%", fontSize: moderateScale(12) },
                  ]}
                />
              </View>
              {remark === "" ? (
                <Text style={styleScheet.optionalText}>optional!</Text>
              ) : null}
            </View>
            <View style={styleScheet.cardContainer}>
              <View style={{ flex: 3 / 2 }}>
                <Text
                  style={[
                    MeetingStyle.MeetingLabel,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Select Room
                </Text>
                <SelectDropdown
                  data={meetingRoomData?.selectMeetingRoom}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem, index);
                    setMeetingRoom(selectedItem?._id);
                    setMeetingRoomName(selectedItem?.value);
                  }}
                  renderCustomizedButtonChild={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              MeetingStyle.MeetingLabel,
                              { fontSize: moderateScale(12) },
                            ]}
                          >
                            {selectedItem?.value
                              ? selectedItem?.value
                              : "Room's name"}
                          </Text>
                        </View>

                        <Image
                          source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                          style={{
                            width: moderateScale(15),
                            height: moderateScale(15),
                            marginRight: moderateScale(10),
                          }}
                        />
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
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={[
                            MeetingStyle.MeetingLabel,
                            { fontSize: moderateScale(12) },
                          ]}
                        >
                          {item?.value}
                        </Text>
                      </View>
                    );
                  }}
                  buttonStyle={{
                    width: "100%",
                    height: moderateScale(50),
                    backgroundColor: "#fff",
                    borderRadius: moderateScale(5),
                  }}
                />

                <Text
                  style={[
                    MeetingStyle.MeetingLabel,
                    {
                      fontSize: moderateScale(8),
                      marginTop: moderateScale(5),
                    },
                  ]}
                >
                  The Room not available on that time: 2pm-3pm, 5pm-6pm
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  width: 1,
                  height: "100%",
                  marginHorizontal: moderateScale(5),
                }}
              />
              <View
                style={{
                  flex: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      MeetingStyle.MeetingLabel,
                      {
                        fontSize: moderateScale(14),
                        marginRight: moderateScale(10),
                      },
                    ]}
                  >
                    Select Chairman
                  </Text>
                  {/* <SelectDropdown
                        data={[10, 20, 40, 80, 160, 200, 240]}
                        onSelect={(selectedItem, index) => {
                          // console.log(selectedItem, index);
                          setChairmanLimit(selectedItem);
                        }}
                        renderCustomizedButtonChild={(selectedItem, index) => {
                          // text represented after item is selected
                          // if data array is an array of objects then return selectedItem.property to render after item is selected
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={[
                                    MeetingStyle.MeetingLabel,
                                    { fontSize: moderateScale(12) },
                                  ]}
                                >
                                  {selectedItem
                                    ? selectedItem
                                    : chairmanLimit.toString()}{" "}
                                  pax
                                </Text>
                              </View>
                            </View>
                          );
                        }}
                        dropdownStyle={{
                          width: moderateScale(65),
                          borderRadius: moderateScale(10),
                          paddingHorizontal: moderateScale(10),
                        }}
                        renderCustomizedRowChild={(item, index) => {
                          // text represented for each item in dropdown
                          // if data array is an array of objects then return item.property to represent item in dropdown
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={[
                                  MeetingStyle.MeetingLabel,
                                  {
                                    fontSize: moderateScale(12),
                                    paddingRight: moderateScale(10),
                                  },
                                ]}
                              >
                                {item}
                              </Text>
                            </View>
                          );
                        }}
                        buttonStyle={{
                          width: moderateScale(65),
                          height: moderateScale(25),
                          backgroundColor: "#fff",
                          borderRadius: moderateScale(5),
                          borderWidth: 1,
                          borderColor: "#082b9e",
                        }}
                      /> */}
                </View>

                <SelectDropdown
                  search={true}
                  searchInputStyle={{
                    backgroundColor: "#f1f1f1",
                  }}
                  searchInputTxtStyle={{
                    fontFamily: "Century-Gothic-Bold",
                  }}
                  searchInputTxtColor="#000"
                  searchPlaceHolder="e.x:   brosphoem"
                  searchPlaceHolderColor="#dcdcdc"
                  data={chairmans}
                  onSelect={(selectedItem, index) => {
                    // console.log(selectedItem, index);
                    setChairmanId(selectedItem?._id);
                    setChairmanName(selectedItem?.value);
                  }}
                  renderCustomizedButtonChild={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          {/* <Image
                            source={
                              selectedItem?.profileImage
                                ? {
                                    uri: selectedItem?.profileImage,
                                  }
                                : require("../assets/Images/user.png")
                            }
                            style={{
                              width: moderateScale(30),
                              height: moderateScale(30),
                              marginRight: moderateScale(10),
                              borderRadius: 200,
                              borderWidth: moderateScale(1),
                              borderColor: COLORS.BLUE_DARK,
                            }}
                          /> */}
                          <Text
                            style={[
                              MeetingStyle.MeetingLabel,
                              { fontSize: moderateScale(12) },
                            ]}
                          >
                            {selectedItem?.value
                              ? selectedItem?.value
                              : "Chairman's name"}
                          </Text>
                        </View>

                        <Image
                          source={require("../assets/Images/arrow-down-sign-to-navigate.png")}
                          style={{
                            width: moderateScale(15),
                            height: moderateScale(15),
                          }}
                        />
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* <Image
                          source={
                            item?.profileImage
                              ? {
                                  uri: item?.profileImage,
                                }
                              : require("../assets/Images/user.png")
                          }
                          style={{
                            width: moderateScale(35),
                            height: moderateScale(35),
                            marginRight: moderateScale(20),
                            borderWidth: moderateScale(1),
                            borderColor: COLORS.BLUE_DARK,
                            borderRadius: 200,
                          }}
                        /> */}
                        <Text
                          style={[
                            MeetingStyle.MeetingLabel,
                            {
                              fontSize: moderateScale(12),
                              paddingRight: moderateScale(10),
                            },
                          ]}
                        >
                          {item?.value}
                        </Text>
                      </View>
                    );
                  }}
                  buttonStyle={{
                    width: "100%",
                    height: moderateScale(50),
                    backgroundColor: "#fff",
                    borderRadius: moderateScale(5),
                  }}
                />

                <Text
                  style={[
                    MeetingStyle.MeetingLabel,
                    {
                      fontSize: moderateScale(8),
                      marginTop: moderateScale(5),
                    },
                  ]}
                >
                  The Chairman not available on that time: 2pm-3pm, 5pm-6pm
                </Text>
              </View>
            </View>
            {meetingRoom === "" && chairmanId === "" && (
              <View style={{ width: "100%", flexDirection: "row" }}>
                <Text style={[styleScheet.requireText, { flex: 1 }]}>
                  {meetingRoom === "" ? "require!" : ""}
                </Text>
                <Text style={[styleScheet.requireText, { flex: 1 }]}>
                  {chairmanId === "" ? "require!" : ""}
                </Text>
              </View>
            )}
            {isKeyboardVisible ? null : (
              <>
                <View style={styleScheet.cardContainer}>
                  <View style={{ flex: 3 / 2 }}>
                    <Text
                      style={[
                        MeetingStyle.MeetingLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      Date
                    </Text>
                    <TouchableOpacity
                      style={{
                        marginTop: moderateScale(10),
                        flexDirection: "row",
                      }}
                      onPress={showDatePicker}
                    >
                      <Image
                        source={require("../assets/Images/calendar.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(5),
                        }}
                      />
                      <Text
                        style={[
                          MeetingStyle.MeetingLabel,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {moment(date).format("DDD-MMM-YYYY")}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: "#fff",
                      width: 1,
                      height: "100%",
                      marginHorizontal: moderateScale(10),
                    }}
                  />
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={showStartPicker}
                  >
                    <Text
                      style={[
                        MeetingStyle.MeetingLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      Start
                    </Text>
                    <View
                      style={{
                        marginTop: moderateScale(10),
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        source={require("../assets/Images/time.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <Text
                        style={[
                          MeetingStyle.MeetingLabel,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {moment(start).format("hh:mm")}
                      </Text>
                    </View>
                    <DateTimePickerModal
                      isVisible={isStartPickerVisible}
                      mode="time"
                      onConfirm={handleStart}
                      onCancel={hideStartPicker}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1 }} onPress={showEndPicker}>
                    <Text
                      style={[
                        MeetingStyle.MeetingLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      End
                    </Text>
                    <View
                      style={{
                        marginTop: moderateScale(10),
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        source={require("../assets/Images/time.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <Text
                        style={[
                          MeetingStyle.MeetingLabel,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {moment(end).format("hh:mm")}
                      </Text>
                      <DateTimePickerModal
                        isVisible={isEndPickerVisible}
                        mode="time"
                        onConfirm={handleEnd}
                        onCancel={hideEndPicker}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styleScheet.cardContainer}>
                  <TouchableOpacity
                    style={{ width: "100%", height: "100%" }}
                    onPress={showDatetimePicker}
                  >
                    <Text
                      style={[
                        MeetingStyle.MeetingLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      Reminder
                    </Text>
                    <View
                      style={{
                        marginTop: moderateScale(10),
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        source={require("../assets/Images/calendar.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <Text
                        style={[
                          MeetingStyle.MeetingLabel,
                          {
                            fontSize: moderateScale(14),
                            marginRight: moderateScale(10),
                          },
                        ]}
                      >
                        {moment(datetime).format("DD MMMM YYYY")}
                      </Text>
                      <Image
                        source={require("../assets/Images/time.png")}
                        style={{
                          width: moderateScale(20),
                          height: moderateScale(20),
                          marginRight: moderateScale(10),
                        }}
                      />
                      <Text
                        style={[
                          MeetingStyle.MeetingLabel,
                          { fontSize: moderateScale(14) },
                        ]}
                      >
                        {moment(datetime).format("hh:mm a")}
                      </Text>
                      <DateTimePickerModal
                        isVisible={isDatetimePickerVisible}
                        mode="datetime"
                        onConfirm={handleDatetime}
                        onCancel={hideDatetimePicker}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* {topic === "" ||
            chairmanId === "" ||
            meetingRoom === "" ||
            isKeyboardVisible ? null : ( */}
            <TouchableOpacity
              style={[
                MeetingStyle.MeetingNextButton,
                {
                  marginTop: moderateScale(20),
                  borderRadius: moderateScale(10),
                  padding: moderateScale(10),
                  alignItems: "center",
                },
              ]}
              onPress={() =>
                navigate("/member", {
                  state: {
                    topic,
                    description,
                    date,
                    start,
                    end,
                    chairmanId,
                    remark,
                    meetingRoom,
                    datetime,
                    meetingRoomName,
                    chairmanName,
                  },
                })
              }
            >
              <Text
                style={[
                  MeetingStyle.MeetingNext,
                  { fontSize: moderateScale(14) },
                ]}
              >
                NEXT
              </Text>
            </TouchableOpacity>
            {/* )} */}
          </ScrollView>
        </Animatable.View>
      </SwiperPage>
    </View>
  );
}

const styleScheet = StyleSheet.create({
  requireText: {
    color: "red",
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
  },
  optionalText: {
    color: "orange",
    fontSize: moderateScale(12),
    marginTop: moderateScale(5),
  },
  cardContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#082b9e",
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: moderateScale(20),
  },
});
