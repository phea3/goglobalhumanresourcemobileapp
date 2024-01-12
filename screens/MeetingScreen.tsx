import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MeetingStyle from "../styles/MeetingStyle.scss";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { moderateScale } from "../ Metrics";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import * as Animatable from "react-native-animatable";
import SwiperPage from "../includes/SwiperPage";

export default function MeetingScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [request, setRequest] = useState(false);
  const [listView, setListView] = useState(false);
  const [requestView, setRequestView] = useState(true);

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

  useEffect(() => {
    if (listView && !requestView) {
      setTimeout(() => {
        setRequest(true);
      }, 1000);
    } else if (!listView && requestView) {
      setTimeout(() => {
        setRequest(false);
      }, 1000);
    }
  }, [listView, requestView]);

  return (
    <View
      style={[
        MeetingStyle.MeetingContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
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
              {requestView ? "Request" : "< Back"}
            </Text>
          </TouchableOpacity>
        </View>
        {request ? (
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
              <View style={{ marginBottom: moderateScale(20) }}>
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
                    value={topic}
                    onChangeText={(e) => setTopic(e)}
                    placeholder="Enter Topic"
                    style={[
                      MeetingStyle.MeetingPlaceholder,
                      { width: "100%", fontSize: moderateScale(12) },
                    ]}
                  />
                </View>
              </View>
              <View style={{ marginBottom: moderateScale(20) }}>
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
                    value={topic}
                    onChangeText={(e) => setTopic(e)}
                    placeholder="Description"
                    style={[
                      MeetingStyle.MeetingPlaceholder,
                      { width: "100%", fontSize: moderateScale(12) },
                    ]}
                  />
                </View>
              </View>
              <View
                style={{
                  marginBottom: moderateScale(20),
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      MeetingStyle.MeetingLabel,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    Date
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
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      {moment(date).format("DDD-MMM-YYYY")}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 2, paddingLeft: moderateScale(10) }}>
                  <Text
                    style={[
                      MeetingStyle.MeetingLabel,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    Select Chairman
                  </Text>
                  <SelectDropdown
                    data={["1"]}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index);
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../assets/Images/user.png")}
                              style={{
                                width: moderateScale(30),
                                height: moderateScale(30),
                                marginRight: moderateScale(10),
                              }}
                            />
                            <Text
                              style={[
                                MeetingStyle.MeetingLabel,
                                { fontSize: moderateScale(12) },
                              ]}
                            >
                              Choose time off
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
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={[
                              MeetingStyle.MeetingLabel,
                              { fontSize: moderateScale(12) },
                            ]}
                          >
                            {item}
                          </Text>
                        </View>
                      );
                    }}
                    buttonStyle={{
                      width: "100%",
                      height: moderateScale(40),
                      backgroundColor: "#fff",
                      borderRadius: moderateScale(5),
                    }}
                  />
                  <Text
                    style={[
                      MeetingStyle.MeetingLabel,
                      { fontSize: moderateScale(10) },
                    ]}
                  >
                    The Chairman not available on that time: 2pm-3pm, 5pm-6pm
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginBottom: moderateScale(20),
                  flexDirection: "row",
                }}
              >
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
                    data={["1"]}
                    onSelect={(selectedItem, index) => {
                      // console.log(selectedItem, index);
                    }}
                    renderCustomizedButtonChild={(selectedItem, index) => {
                      // text represented after item is selected
                      // if data array is an array of objects then return selectedItem.property to render after item is selected
                      return (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
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
                              A8
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
                            {item}
                          </Text>
                        </View>
                      );
                    }}
                    buttonStyle={{
                      width: "100%",
                      height: moderateScale(40),
                      backgroundColor: "#fff",
                      borderRadius: moderateScale(5),
                    }}
                  />
                  <Text
                    style={[
                      MeetingStyle.MeetingLabel,
                      { fontSize: moderateScale(10) },
                    ]}
                  >
                    The Room not available on that time: 2pm-3pm, 5pm-6pm
                  </Text>
                </View>
                <TouchableOpacity style={{ flex: 1 }}>
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
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }}>
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
                      {moment(end).format("hh:mm")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ marginBottom: moderateScale(20) }}>
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
                    value={topic}
                    onChangeText={(e) => setTopic(e)}
                    placeholder="Remark"
                    style={[
                      MeetingStyle.MeetingPlaceholder,
                      { width: "100%", fontSize: moderateScale(12) },
                    ]}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={[
                  MeetingStyle.MeetingNextButton,
                  {
                    marginTop: moderateScale(60),
                    borderRadius: moderateScale(10),
                    padding: moderateScale(10),
                    alignItems: "center",
                  },
                ]}
                onPress={() => navigate("/member")}
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
            </ScrollView>
          </Animatable.View>
        ) : (
          <Animatable.View
            animation={requestView ? "fadeInUp" : "fadeOutDown"}
            style={MeetingStyle.MeetingBodyContainer}
          >
            <View
              style={[
                MeetingStyle.MeetingBartitileBackground,
                { width: "95%" },
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
                  Topic
                </Text>
              </View>
              <View
                style={{
                  width: "33.3%",
                  justifyContent: "center",
                  alignItems: "center",
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
                  width: "33.3%",
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
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
              style={{ flex: 1, width: "100%" }}
              onScroll={handleScroll}
              onScrollEndDrag={handleScrollEnd}
              onMomentumScrollEnd={handleScrollEnd}
              scrollEventThrottle={16}
            >
              {[...Array(20)].map((index: number) => (
                <View
                  key={index}
                  style={[
                    {
                      flexDirection: "row",
                      width: "95%",
                      borderBottomWidth: moderateScale(1),
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
                      Meeting
                    </Text>
                    <Text
                      style={[
                        MeetingStyle.MeetingPlaceholder,
                        { fontSize: moderateScale(12) },
                      ]}
                    >
                      Gossip
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "33.3%",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: moderateScale(10),
                    }}
                  >
                    <Text
                      style={[
                        MeetingStyle.MeetingLabel,
                        { fontSize: moderateScale(14) },
                      ]}
                    >
                      12-12-2023
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "33.3%",
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
                      Cancel
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </Animatable.View>
        )}
      </SwiperPage>
    </View>
  );
}
