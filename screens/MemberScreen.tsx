import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MemberStyle from "../styles/MemberStyle.scss";
import { moderateScale } from "../ Metrics";
import { useLocation, useNavigate } from "react-router-native";
// import * as Animatable from "react-native-animatable";
import Checkbox from "expo-checkbox";
import { useContext, useEffect, useState } from "react";
import MeetingStyle from "../styles/MeetingStyle.scss";

import { useMutation, useQuery } from "@apollo/client";
import { REQUESTMEETING } from "../graphql/ReqeustMeeting";
import { GETCHAIRMAN } from "../graphql/SelectChairman";
import ImageList from "../functions/ImageList";
import { COLORS } from "../color";
import moment from "moment";
import { AuthContext } from "../Context/AuthContext";

export default function MemberScreen() {
  const { widthScreen } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [limit, setLimit] = useState(10);
  const values = location.state;
  const [load, setLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);
  const [checkedItems, setCheckedItems] = useState<
    Array<{ _id: string | null; memberName: string | null; isChecked: boolean }>
  >([]);
  const [memberItems, setMemberItems] = useState<
    Array<{ _id: string | null; memberName: string | null }>
  >([]);

  const handleItemPress = (
    index: number,
    itemId: string | null,
    itemMemberName: string | null
  ) => {
    const newCheckedItems = [...checkedItems];

    // If the item is checked, remove it from the array
    if (newCheckedItems[index]?.isChecked) {
      newCheckedItems[index] = undefined!;
    } else {
      // If the item is unchecked, add it to the array
      newCheckedItems[index] = {
        _id: itemId,
        memberName: itemMemberName,
        isChecked: true,
      };
    }
    // Remove isChecked property from each item in newCheckedItems array
    const newMemberItems = newCheckedItems.map((item) => {
      if (item) {
        const { isChecked, ...newItem } = item;
        return newItem;
      }
      return item;
    });

    setMemberItems(newMemberItems);
    setCheckedItems(newCheckedItems);
  };

  const [chairmanData, setChairmanData] = useState([]);

  const { refetch: chairmanRefetch } = useQuery(GETCHAIRMAN, {
    pollInterval: 2000,
    variables: {
      limit: limit,
    },
    onCompleted: ({ selectChairman }) => {
      // console.log("selectChairman: ", selectChairman);
      setChairmanData(selectChairman);
    },
  });

  useEffect(() => {
    chairmanRefetch();
  }, []);

  const [reqeustMeeting] = useMutation(REQUESTMEETING);

  const requestHandler = () => {
    const newValues = {
      chairman: values?.chairmanId,
      date: moment(values?.date).format("YYYY-MM-DD"),
      description: values?.description,
      end: moment(values?.end).format("YYYY-MM-DD"),
      members: checkedItems
        ?.filter((e) => e !== undefined)
        .map((item) => {
          if (item) {
            const { isChecked, ...newItem } = item;
            return newItem;
          }
          return item;
        }),
      notify: [
        {
          date: moment(values?.dateime).format("YYYY-MM-DD"),
          time: moment(values?.dateime).format("HH:mm"),
        },
      ],
      remark: values?.remark,
      start: moment(values?.start).format("YYYY-MM-DD"),
      topic: values?.topic,
      venue: values?.meetingRoom,
    };
    // console.log("newValues:", newValues);

    reqeustMeeting({
      variables: {
        input: {
          ...newValues,
        },
      },
      onCompleted(data) {
        console.log(data);
        Alert.alert("Request", data?.reqeustMeeting?.message, [
          {
            text: "OK",
            onPress: () => navigate("/meeting"),
            style: "cancel",
          },
        ]);
      },
      onError(error) {
        console.log(error);
        Alert.alert("Oop!", error?.message);
      },
    });
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => handleItemPress(index, item._id, item.value)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: moderateScale(10),
      }}
    >
      {/* Your existing Image components */}
      <Image
        source={
          checkedItems[index]?.isChecked
            ? require("../assets/Images/check.png")
            : require("../assets/Images/square.png")
        }
        style={{
          width: moderateScale(25),
          height: moderateScale(25),
          marginRight: moderateScale(10),
          borderWidth: moderateScale(1),
          borderColor: "#082b9e",
          borderRadius: moderateScale(5),
          padding: moderateScale(5),
        }}
      />
      <Image
        source={
          item?.profileImage
            ? { uri: item?.profileImage }
            : require("../assets/Images/user.png")
        }
        style={[
          {
            height: moderateScale(30),
            width: moderateScale(30),
            marginRight: moderateScale(10),
            borderRadius: 200,
            borderWidth: moderateScale(1),
            borderColor: "#3C6EFB",
          },
        ]}
      />
      <Text
        style={{
          fontFamily: "Kantumruy-Regular",
          fontSize: moderateScale(12),
          textAlign: "left",
        }}
      >
        {item?.value}
      </Text>
    </TouchableOpacity>
  );
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
          style={[
            MemberStyle.MemberBackButton,
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
            // requestHandler();
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
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // navigate("/meeting");
            requestHandler();
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
      <View
        // animation={"fadeInUp"}
        style={MemberStyle.MemberBodyContainer}
      >
        <View
          style={{
            flex: 1,
            opacity: 0,
            position: "absolute",
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                width: widthScreen * 0.9,
                borderWidth: moderateScale(2),
                borderColor: "#082b9e",
                borderRadius: moderateScale(20),
                padding: moderateScale(5),
                paddingHorizontal: moderateScale(10),
                marginHorizontal: widthScreen * 0.05,
              }}
            >
              <View style={styleSheetMemeber.valueRow}>
                <Text style={styleSheetMemeber.valueTitle}>Topic</Text>
                <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                <Text style={styleSheetMemeber.valueBody}>
                  {values.topic ? values.topic : "--:--"}
                </Text>
              </View>

              <View style={styleSheetMemeber.valueRow}>
                <Text style={styleSheetMemeber.valueTitle}>Description</Text>
                <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                <Text style={styleSheetMemeber.valueBody}>
                  {values.description ? values.description : "--:--"}
                </Text>
              </View>
              <View style={styleSheetMemeber.valueRow}>
                <Text style={styleSheetMemeber.valueTitle}>Chairman</Text>
                <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                <Text style={styleSheetMemeber.valueBody}>
                  {values.chairmanName ? values.chairmanName : "--:--"}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={[styleSheetMemeber.valueRow, { width: "50%" }]}>
                  <Text style={styleSheetMemeber.valueTitle}>Date</Text>
                  <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                  <Text style={styleSheetMemeber.valueBody}>
                    {moment(values.date).format("DD MM YYYY")}
                  </Text>
                </View>

                <View style={[styleSheetMemeber.valueRow, { width: "50%" }]}>
                  <Text style={styleSheetMemeber.valueTitle}>Room</Text>
                  <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                  <Text style={styleSheetMemeber.valueBody}>
                    {values.meetingRoomName ? values.meetingRoomName : "--:--"}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={[styleSheetMemeber.valueRow, { width: "50%" }]}>
                  <Text style={styleSheetMemeber.valueTitle}>Start</Text>
                  <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                  <Text style={styleSheetMemeber.valueBody}>
                    {moment(values.start).format("hh:mm A")}
                  </Text>
                </View>

                <View style={[styleSheetMemeber.valueRow, { width: "50%" }]}>
                  <Text style={styleSheetMemeber.valueTitle}>End</Text>
                  <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                  <Text style={styleSheetMemeber.valueBody}>
                    {moment(values.end).format("hh:mm A")}
                  </Text>
                </View>
              </View>

              <View style={styleSheetMemeber.valueRow}>
                <Text style={styleSheetMemeber.valueTitle}>Notification</Text>
                <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                <Text style={styleSheetMemeber.valueBody}>
                  {moment(values.datetime).format("DD MMM YYYY hh:mm A")}
                </Text>
              </View>
              <View style={styleSheetMemeber.valueRow}>
                <Text style={styleSheetMemeber.valueTitle}>Remark</Text>
                <Text style={styleSheetMemeber.valueConjun}>៖</Text>
                <Text style={styleSheetMemeber.valueBody}>
                  {values.remark ? values.remark : "--:--"}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: widthScreen * 0.9,
                borderWidth: moderateScale(2),
                borderColor: "#082b9e",
                borderRadius: moderateScale(20),
                padding: moderateScale(5),
                paddingHorizontal: moderateScale(10),
                marginHorizontal: widthScreen * 0.05,
              }}
            >
              <Text style={styleSheetMemeber.valueTitle}>
                Member ៖ {checkedItems?.filter((e) => e !== undefined).length}{" "}
                {checkedItems?.filter((e) => e !== undefined).length > 1
                  ? "people"
                  : "person"}
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
              >
                <Text style={styleSheetMemeber.valueBody}>
                  {checkedItems?.filter((e) => e !== undefined) &&
                  checkedItems?.filter((e) => e !== undefined).length > 0
                    ? checkedItems
                        ?.filter((e) => e !== undefined)
                        .map(
                          (item, index) => `${index + 1}). ${item.memberName}`
                        )
                        .join(", \n")
                    : "--:--"}
                </Text>
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        {load ? (
          <View style={{ flex: 2 }}>
            <Image
              source={require("../assets/Images/loader-1.gif")}
              style={{
                width: moderateScale(100),
                height: moderateScale(100),
              }}
            />
          </View>
        ) : (
          <View style={{ flex: 2, width: "90%" }}>
            <Text style={styleSheetMemeber.valueTitle}>
              Member ៖ {checkedItems?.filter((e) => e !== undefined).length}{" "}
              {checkedItems?.filter((e) => e !== undefined).length > 1
                ? "people"
                : "person"}
            </Text>
            <FlatList
              data={chairmanData.slice(0, limit)}
              keyExtractor={(item: any) => item._id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              style={{
                width: "100%",
                marginTop: moderateScale(20),
              }}
            />
            {/* {chairmanData.length >= limit ? ( */}
            <TouchableOpacity
              onPress={() => {
                setLimit(40 + limit);
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
            {/*) : null}*/}
          </View>
        )}
      </View>
    </View>
  );
}

const styleSheetMemeber = StyleSheet.create({
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueTitle: {
    fontFamily: "Kantumruy-Bold",
    fontSize: moderateScale(14),
  },
  valueBody: {
    fontFamily: "Kantumruy-Regular",
    fontSize: moderateScale(14),
  },
  valueConjun: {
    marginHorizontal: moderateScale(10),
    fontFamily: "Kantumruy-Bold",
    fontSize: moderateScale(14),
  },
});
