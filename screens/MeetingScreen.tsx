import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";
import moment from "moment";
import * as Animatable from "react-native-animatable";
import SwiperPage from "../includes/SwiperPage";
import { useQuery } from "@apollo/client";
import { GETMEETINGSMOBILE } from "../graphql/GetMeetingsMobile";
import { Calendar, LocaleConfig } from "react-native-calendars";

export default function MeetingScreen() {
  const navigate = useNavigate();
  const { uid } = useContext(AuthContext);
  const [listView, setListView] = useState(false);
  const [requestView, setRequestView] = useState(true);
  const [limit, setLimit] = useState(10);
  const [isScrolling, setIsScrolling] = useState(false);
  const [selected, setSelected] = useState("");
  const [meetings, setMeetings] = useState([]);
  const { widthScreen } = useContext(AuthContext);

  const { refetch: meetingRefetch } = useQuery(GETMEETINGSMOBILE, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: ({ getMeetingsMobile }) => {
      setMeetings(getMeetingsMobile);
    },
  });

  useEffect(() => {
    meetingRefetch();
  }, [uid]);

  const handleScroll = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    setIsScrolling(false);
  };

  useEffect(() => {
    if (listView && !requestView) {
      setTimeout(() => {
        navigate("/requestmeeting");
      }, 1000);
    }
  }, [listView, requestView]);

  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
        },
      ]}
    >
      <SwiperPage path={"/home"} page="meeting" isScrolling={isScrolling}>
        <View style={MeetingStyle.MeetingBackButtonContainer}>
          <TouchableOpacity
            onPress={() => navigate("/home")}
            style={[
              MeetingStyle.MeetingBackButton,
              { padding: moderateScale(15), flex: 1 },
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
                MeetingStyle.MeetingBackButtonTitle,
                { fontSize: moderateScale(14) },
              ]}
            >
              Mettings
            </Text>
          </TouchableOpacity>
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
              Request
            </Text>
          </TouchableOpacity>
        </View>
        <Animatable.View
          animation={requestView ? "fadeInUp" : "fadeOutDown"}
          style={MeetingStyle.MeetingBodyContainer}
        >
          {/* <View
            style={[MeetingStyle.MeetingBartitileBackground, { width: "95%" }]}
          >
            <View
              style={{
                width: "33.3%",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: moderateScale(10),
              }}
            >
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Topic
              </Text>
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: moderateScale(10),
              }}
            >
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Date
              </Text>
            </View>
            <View
              style={{
                width: "30%",
                justifyContent: "center",
                padding: moderateScale(10),
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Status
              </Text>
            </View>
            <View
              style={{
                width: "6.6%",
                justifyContent: "center",
                padding: moderateScale(10),
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  MeetingStyle.MeetingLabel,
                  { fontSize: moderateScale(14) },
                ]}
              ></Text>
            </View>
          </View> */}

          {meetings === null || meetings === undefined ? (
            <View
              style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Century-Gothic-Bold",
                  fontSize: moderateScale(14),
                }}
              >
                Empty
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
              style={{ flex: 1, width: "100%" }}
              onScroll={handleScroll}
              onScrollEndDrag={handleScrollEnd}
              onMomentumScrollEnd={handleScrollEnd}
              scrollEventThrottle={16}
            >
              <Calendar
                style={{
                  width: widthScreen * 0.95,
                  height: moderateScale(350),
                  borderRadius: moderateScale(20),
                  shadowColor: "#082b9e",
                  shadowOffset: {
                    width: 0,
                    height: moderateScale(2),
                  },
                  shadowOpacity: moderateScale(0.25),
                  shadowRadius: moderateScale(3.84),

                  elevation: moderateScale(5),
                  marginTop: moderateScale(20),
                }}
                onDayPress={(day) => {
                  setSelected(day.dateString);
                  console.log("selected day", day);
                }}
                markedDates={{
                  [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                  },
                }}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: "#b6c1cd",
                  selectedDayBackgroundColor: "#00adf5",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#00adf5",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e",
                }}
              />
              {meetings.map((i: any, index: number) => (
                <View
                  key={index}
                  style={[
                    {
                      flexDirection: "row",
                      width: "95%",
                      borderBottomWidth: moderateScale(0.5),
                      borderColor: "#dcdcdc",
                    },
                  ]}
                >
                  <View
                    style={{
                      width: "33.3%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      padding: moderateScale(10),
                    }}
                  >
                    <Text
                      style={[
                        MeetingStyle.MeetingLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {i.topic}
                    </Text>
                    <Text
                      style={[
                        MeetingStyle.MeetingPlaceholder,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      {i.description}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      padding: moderateScale(10),
                    }}
                  >
                    <Text
                      style={[
                        MeetingStyle.MeetingPlaceholder,
                        { fontSize: moderateScale(13) },
                      ]}
                    >
                      {moment(i.date).format("DD-MM-YYYY")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      justifyContent: "center",
                      padding: moderateScale(10),
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: moderateScale(12),
                        fontFamily: "Century-Gothic-Bold",

                        color: "orange",
                      }}
                    >
                      Pending
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: "6.6%",
                      justifyContent: "center",
                      padding: moderateScale(10),
                      alignItems: "center",
                    }}
                    onPress={() => {
                      navigate("/meetingdetail");
                    }}
                  >
                    <Image
                      source={require("../assets/Images/dots.png")}
                      style={{
                        width: moderateScale(20),
                        height: moderateScale(20),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              {meetings.length >= limit ? (
                <TouchableOpacity
                  onPress={() => {
                    setLimit(10 + limit);
                  }}
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: moderateScale(50),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Century-Gothic-Bold",
                      color: "#3c6efb",
                      fontSize: moderateScale(16),
                    }}
                  >
                    {"see more..."}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </ScrollView>
          )}
        </Animatable.View>
      </SwiperPage>
    </View>
  );
}
