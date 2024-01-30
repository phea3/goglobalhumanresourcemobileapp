import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MemberStyle from "../styles/MemberStyle.scss";
import { moderateScale } from "../ Metrics";
import { useLocation, useNavigate } from "react-router-native";
import * as Animatable from "react-native-animatable";
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
  const [limit, setLimit] = useState(210);
  const values = location.state;
  const [load, setLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [valueTextSearch, setvalueTextSearch] = useState("");
  const [dataChairOption, setDataChairOption] = useState([]);
  const [seleted, setSeleted] = useState(false);
  const [chairmanData, setChairmanData] = useState<
    Array<{
      _id: string | null;
      value: string | null;
      profileImage: string | null;
    }>
  >([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);

  const [checkedItems, setCheckedItems] = useState<
    Array<{
      _id: string | null;
      value: string | null;
      profileImage: string | null;
    }>
  >([]);

  const handleMatchID = (id: string | null) => {
    let match = false;
    let newArray = checkedItems?.filter((value) => value?._id === id);
    if (newArray?.length > 0) {
      match = true;
    } else {
      match = false;
    }
    return match;
  };

  // ===================  Function Select Item ====================
  const handleItemPress = (
    itemId: string | null,
    itemMemberName: string | null,
    profileImage: string | null
  ) => {
    let newCheckedItems = [...checkedItems];

    let object = {
      _id: itemId,
      value: itemMemberName,
      profileImage: profileImage,
    };

    if (newCheckedItems?.length > 0) {
      let matchState = handleMatchID(itemId);
      if (matchState) {
        //=================  Remove Member Already Selected =================
        let removeMember = newCheckedItems?.filter((e) => e._id !== itemId);
        setCheckedItems([...removeMember]);
        if (removeMember.length === 0) {
          setSeleted(false);
        }
      } else {
        //=================  Add New Member =================
        newCheckedItems.push(object);
        setCheckedItems([...newCheckedItems]);
      }
    } else {
      //=================  Add First Member =================
      setCheckedItems([object]);
    }

    // setvalueTextSearch("");
    // setChairmanData([...dataChairOption]);
  };

  //================= Handler Remove array ====================

  const handleRemoveArray = (itemId: string | null) => {
    let newCheckedItems = [...checkedItems];
    let removeMember = newCheckedItems?.filter((e) => e._id !== itemId);
    setCheckedItems([...removeMember]);
    if (newCheckedItems.length === 1) {
      setSeleted(false);
    }
  };

  //===================  Get All Chairman ==========================
  const {
    data: chaimdata,
    refetch: chairmanRefetch,
    loading: chairmanLoading,
  } = useQuery(GETCHAIRMAN, {
    variables: {
      limit: limit,
    },
    onCompleted: ({ selectChairman }) => {
      //==================== For  Show =================
      setChairmanData(
        selectChairman.map(({ _id, value, profileImage }: any) => ({
          _id,
          value,
          profileImage,
        }))
      );
      // ==================== For Search =================
      setDataChairOption(
        selectChairman.map(({ _id, value, profileImage }: any) => ({
          _id,
          value,
          profileImage,
        }))
      );
    },
  });

  useEffect(() => {
    chairmanRefetch();
  }, []);

  const handleSearch = (text: string) => {
    let filteredArray = dataChairOption?.filter((row: any) =>
      row?.value
        ?.replace(/\s/g, "")
        .toLowerCase()
        .includes(text.replace(/\s/g, "").toLowerCase())
    );
    setvalueTextSearch(text);
    if (text !== "" && text !== undefined) {
      setChairmanData([...filteredArray]);
    } else {
      setChairmanData([...dataChairOption]);
    }
  };

  const [reqeustMeeting] = useMutation(REQUESTMEETING);

  const requestHandler = () => {
    const newValues = {
      chairman: values?.chairmanId,
      date: moment(values?.date).format("YYYY-MM-DD"),
      description: values?.description,
      end: moment(values?.end).format("YYYY-MM-DD"),
      members: checkedItems,
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

  //================================  LIST EMPLOYEE ==========================
  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() =>
        handleItemPress(item?._id, item?.value, item?.profileImage)
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: moderateScale(10),
      }}
      key={index}
    >
      {/* Your existing Image components */}

      <Image
        source={
          handleMatchID(item._id)
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
          // item?.profileImage.startsWith("data:image/jpg;base64,") &&
          item?.profileImage
            ? // && item?.profileImage.substring(
              //   "data:image/jpg;base64,".indexOf(",") + 1
              // ).length !== 0
              {
                uri: item?.profileImage,
                // .substring(
                //   "data:image/jpg;base64,".indexOf(",") + 1
                // ),
              }
            : require("../assets/Images/user.png")
        }
        // source={require("../assets/Images/user.png")}
        resizeMode="contain"
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

  const renderHeader = () => {
    if (!refreshing) return null;

    // Replace the ActivityIndicator with your image
    return (
      <View style={{ paddingVertical: moderateScale(20) }}>
        {/* Your image component */}
        <Image
          source={require("../assets/Images/loader-1.gif")}
          style={{ width: moderateScale(50), height: moderateScale(50) }}
        />
      </View>
    );
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      // Fetch new data here
      // For example, using the fetch API:
      chairmanRefetch();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };
  return (
    <View
      style={[
        MemberStyle.MemberContainer,
        {
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
        },
      ]}
    >
      <View style={MemberStyle.MemberBackButtonContainer}>
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
            Select Member
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigate("/requestmeeting");
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
            {"<"} Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
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
      <Animatable.View
        animation={"fadeInUp"}
        style={MemberStyle.MemberBodyContainer}
      >
        {load || chaimdata?.selectChairman?.length === 0 ? (
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
          <View style={{ flex: 2, width: "95%" }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: moderateScale(30),
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: moderateScale(30),
                  borderWidth: moderateScale(1),
                  borderColor: "#082b9e",
                  borderRadius: moderateScale(5),
                  paddingLeft: moderateScale(5),
                  marginRight: moderateScale(5),
                }}
              >
                <Image
                  source={require("../assets/Images/find.png")}
                  style={[
                    {
                      height: moderateScale(20),
                      width: moderateScale(20),
                    },
                  ]}
                />

                <TextInput
                  style={{
                    flex: 1,
                    height: moderateScale(30),
                    paddingLeft: moderateScale(5),
                    fontFamily: "Kantumruy-Regular",
                    fontSize: moderateScale(12),
                    textAlign: "left",
                  }}
                  placeholder="Search..."
                  value={valueTextSearch}
                  onChangeText={handleSearch}
                />
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  height: moderateScale(30),
                  width: moderateScale(30),
                  backgroundColor: "#ff0000",
                  marginRight: moderateScale(5),
                  borderRadius: moderateScale(5),
                }}
                onPress={() => {
                  setvalueTextSearch("");
                  setChairmanData([...dataChairOption]);
                }}
              >
                <Image
                  source={require("../assets/Images/cross.png")}
                  style={[
                    {
                      height: moderateScale(20),
                      width: moderateScale(20),
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: 30,
                  marginVertical: moderateScale(5),
                }}
                activeOpacity={checkedItems.length > 0 ? 0.4 : 1}
                onPress={() => {
                  if (checkedItems.length > 0) {
                    setSeleted(!seleted);
                  }
                }}
              >
                <Image
                  source={
                    seleted
                      ? require("../assets/Images/check.png")
                      : require("../assets/Images/square.png")
                  }
                  style={{
                    width: moderateScale(29),
                    height: moderateScale(29),
                    marginRight: moderateScale(5),
                    borderWidth: moderateScale(1),
                    borderColor: "#082b9e",
                    borderRadius: moderateScale(5),
                    padding: moderateScale(5),
                  }}
                />
                {/* <View
                  style={{
                    backgroundColor: "#082b9e",
                    width: moderateScale(65),
                    height: moderateScale(30),
                    borderRadius: moderateScale(5),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Kantumruy-Bold",
                      fontSize: moderateScale(10),
                      textAlign: "left",
                      color: "white",
                    }}
                  >
                    SELECTED
                  </Text>
                </View> */}
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginVertical: moderateScale(5),
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {checkedItems?.map((data: any, index: number) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleRemoveArray(data?._id);
                    }}
                    key={index}
                    style={{
                      padding: moderateScale(4),
                      marginRight: moderateScale(10),
                      borderRadius: moderateScale(10),
                      backgroundColor:
                        index % 3 === 1
                          ? "#e1eefd"
                          : index % 3 === 0
                          ? "#F7F8FE"
                          : "#FFEEDB",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Image
                      source={require("../assets/Images/cross.png")}
                      style={[
                        {
                          height: moderateScale(20),
                          width: moderateScale(20),
                          marginLeft: moderateScale(5),
                          marginRight: moderateScale(5),
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
                      {data?.value}
                    </Text>
                    <Image
                      source={
                        data?.profileImage
                          ? {
                              uri: data?.profileImage,
                            }
                          : require("../assets/Images/user.png")
                      }
                      // source={require("../assets/Images/user.png")}
                      resizeMode="contain"
                      style={[
                        {
                          height: moderateScale(25),
                          width: moderateScale(25),
                          marginLeft: moderateScale(5),
                          borderRadius: 200,
                          borderWidth: moderateScale(1),
                          borderColor: "#3C6EFB",
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {refreshing ? null : seleted === false ? (
              <FlatList
                initialNumToRender={10} // Adjust as needed
                maxToRenderPerBatch={10} // Adjust as needed
                windowSize={10} // Adjust as needed
                data={chairmanData?.slice(0, limit)}
                keyExtractor={(item: any) => item._id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={true}
                style={{
                  width: "100%",
                }}
                refreshing={refreshing}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#dcdcdc"]} // Android
                    tintColor="#dcdcdc" // iOS
                  />
                }
                onEndReached={() => {
                  // This function will be called when the end of the list is reached
                  // Avoid triggering multiple requests while a request is already in progress
                  if (chairmanData.length >= limit) {
                    // setLoading(true);
                    // console.log("limit", limit);
                    // setLimit(10 + limit);
                  }
                }}
                onEndReachedThreshold={0.1} // Adjust this threshold as needed
                ListHeaderComponent={renderHeader}
                ListFooterComponent={() =>
                  chairmanLoading ? (
                    <View
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/Images/Data-Transfer.gif")}
                        resizeMode="contain"
                        style={{
                          width: moderateScale(100),
                          height: moderateScale(100),
                        }}
                      />
                    </View>
                  ) : null
                }
              />
            ) : (
              <FlatList
                data={checkedItems}
                keyExtractor={(item: any) => item._id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                style={{
                  width: "100%",
                }}
                onEndReachedThreshold={0.1}
              />
            )}
            <View
              style={{
                width: "100%",
                alignContent: "flex-end",
                justifyContent: "flex-end",
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <Text style={styleSheetMemeber.valueTitle}>
                Member ៖ {checkedItems?.filter((e) => e !== undefined).length}{" "}
                {checkedItems?.filter((e) => e !== undefined).length > 1
                  ? " people "
                  : " person "}
                / {chairmanData.length}
              </Text>
            </View>
          </View>
        )}
      </Animatable.View>
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
    textAlign: "right",
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
