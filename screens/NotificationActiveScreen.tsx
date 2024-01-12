import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useQuery } from "@apollo/client";
import moment from "moment";

import NotificationActionStyle from "../styles/NotificationActionStyle.scss";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { GET_NOTIFICATION_CONTACT } from "../graphql/NotificationAction";
import SwiperPage from "../includes/SwiperPage";
import { moderateScale } from "../ Metrics";

export default function NotificationActiveScreen() {
  const { dimension } = useContext(AuthContext);
  const [NotificationData, setNotificationData] = useState([]);
  const [limit, setLimit] = useState(10);

  const { data, refetch } = useQuery(GET_NOTIFICATION_CONTACT, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: (data) => {
      // console.log(data);
      setNotificationData(data?.getNotifications);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = () => {
    setIsScrolling(false);
  };

  return (
    <SwiperPage path="/home" page="notificationAcc" isScrolling={isScrolling}>
      <View style={NotificationActionStyle.NotificationActionContainer}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          style={{ flex: 1, width: "100%" }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {NotificationData?.map((card: any, index: number) => (
            <View
              style={[
                NotificationActionStyle.ActionCardContainer,
                {
                  paddingVertical: moderateScale(10),
                  borderBottomWidth: moderateScale(0.5),
                },
              ]}
              key={index}
            >
              <View style={{ marginRight: moderateScale(10) }}>
                <View
                  style={[
                    card?.title === "Leave Cancel"
                      ? NotificationActionStyle.ActionCardIconRed
                      : NotificationActionStyle.ActionCardIcon,
                    {
                      width: moderateScale(40),
                      height: moderateScale(40),
                    },
                  ]}
                >
                  <Image
                    source={require("../assets/Images/briefcase.png")}
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                    }}
                  />
                </View>
              </View>
              <View style={NotificationActionStyle.ActionCardBodyRight}>
                <Text
                  style={[
                    card?.title === "Leave Cancel"
                      ? NotificationActionStyle.ActionLeaveTitleRed
                      : NotificationActionStyle.ActionLeaveTitle,
                    {
                      fontSize: moderateScale(14),
                    },
                  ]}
                >
                  {card?.title}
                </Text>
                <Text
                  style={[
                    card?.title === "Leave Cancel"
                      ? NotificationActionStyle.ActionDatTimeRed
                      : NotificationActionStyle.ActionDatTime,
                    { fontSize: moderateScale(12) },
                  ]}
                >
                  {moment(card?.date).format("DD MMM YY")} | {card?.time}
                </Text>
                <Text
                  style={[
                    card?.title === "Leave Cancel"
                      ? NotificationActionStyle.ActionCommentRed
                      : NotificationActionStyle.ActionComment,
                    { fontSize: moderateScale(12) },
                  ]}
                >
                  {card?.body}
                </Text>
              </View>
            </View>
          ))}
          {NotificationData.length >= limit ? (
            <TouchableOpacity
              onPress={() => {
                setLimit(10 + limit);
              }}
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                height: moderateScale(40),
              }}
            >
              <Text
                style={{ fontFamily: "Century-Gothic-Bold", color: "#3c6efb" }}
              >
                {"see more..."}
              </Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </SwiperPage>
  );
}
