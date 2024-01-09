import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigate } from "react-router-native";
import { useContext, useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DailyAttendanceStyle from "../styles/DailyAttendanceStyle.scss";
import HomeStyle from "../styles/HomeStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_DAILY_ATTENDANCE_REPORT } from "../graphql/GetDailyAttendanceReport";
import * as Animatable from "react-native-animatable";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";

export default function DailyAttendance() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [dateIsvisble, setDateIsvisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [load, setLoad] = useState(true);
  const [dataload, setDataload] = useState(false);

  const ImageWithLoading = ({ uri }: any) => {
    const { dimension } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const handleLoad = () => {
      setLoading(false);
    };

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginRight: 5,
        }}
      >
        {loading && (
          <ActivityIndicator
            style={{ position: "absolute" }}
            size="small"
            color="#2999da"
          />
        )}
        <Image
          source={
            uri ? { uri: uri } : require("../assets/Images/user_phoem.jpg")
          }
          style={[
            DailyAttendanceStyle.DailyAttCardImg,
            {
              height: moderateScale(40),
              width: moderateScale(40),
              borderWidth: moderateScale(1),
            },
          ]}
          onLoad={handleLoad}
        />
      </View>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 1000);
  }, []);

  const {
    data: dailyreport,
    refetch: dailyrefetch,
    loading: dailyloading,
  } = useQuery(GET_DAILY_ATTENDANCE_REPORT, {
    pollInterval: 2000,
    variables: {
      date: date ? moment(date).format("YYYY-MM-DD") : "",
      shift: morning ? "morning" : afternoon ? "afternoon" : "",
    },
    onCompleted: ({ getDailyAttendanceReport }) => {},
    onError(error) {
      console.log(error?.message);
    },
  });

  useEffect(() => {
    dailyrefetch();
  }, []);

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

  useEffect(() => {
    if (dailyloading) {
      setTimeout(() => {
        setDataload(true);
      }, 100);
    } else {
      setTimeout(() => {
        setDataload(false);
      }, 1000);
    }
  }, [dailyloading]);

  return (
    <View
      style={[
        DailyAttendanceStyle.DailyAttContainer,
        {
          borderTopLeftRadius: moderateScale(15),
          borderTopRightRadius: moderateScale(15),
          borderTopWidth: moderateScale(1),
          borderRightWidth: moderateScale(1),
          borderLeftWidth: moderateScale(1),
        },
      ]}
    >
      <View style={DailyAttendanceStyle.DailyAttBackButtonContainer}>
        <TouchableOpacity
          onPress={() => navigate("/report")}
          style={[
            DailyAttendanceStyle.DailyAttBackButton,
            { padding: moderateScale(15) },
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
            numberOfLines={1}
            style={[
              DailyAttendanceStyle.DailyAttBackButtonTitle,
              {
                fontSize: moderateScale(14),
              },
            ]}
          >
            DAIILY ATTENDANCES
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          DailyAttendanceStyle.DailyAttBodyContainer,
          { padding: moderateScale(10), borderRadius: moderateScale(10) },
        ]}
      >
        <View style={DailyAttendanceStyle.CheckMainSelectDateSection}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <TouchableOpacity
              style={[
                DailyAttendanceStyle.CheckMainSelectDateButton,
                {
                  marginRight: 10,
                  height: moderateScale(40),
                  borderRadius: moderateScale(10),
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
                  DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder,
                  { fontSize: moderateScale(12) },
                ]}
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
                style={{
                  width: moderateScale(20),
                  height: moderateScale(20),
                  marginRight: moderateScale(10),
                }}
              />
              <Text
                style={[
                  DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder,
                  { fontSize: moderateScale(12) },
                ]}
              >
                Afternoon
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={showDatePicker}
            style={
              dimension === "sm"
                ? DailyAttendanceStyle.DailyAttMainSelectDateButtonSM
                : DailyAttendanceStyle.DailyAttMainSelectDateButton
            }
          >
            <Image
              source={require("../assets/Images/calendar.png")}
              style={{
                width: moderateScale(20),
                height: moderateScale(20),
                marginRight: moderateScale(10),
              }}
            />
            <View
              style={DailyAttendanceStyle.DailyAttMainMainSelectDateSection}
            >
              <View>
                <Text
                  style={[
                    DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder,
                    { fontSize: moderateScale(12) },
                  ]}
                >
                  {moment(date).format("DD-MM-YYYY")}
                </Text>
              </View>
              <DateTimePickerModal
                isVisible={dateIsvisble}
                mode="date"
                onConfirm={handConfirm}
                onCancel={hidDatePicker}
              />
            </View>
          </TouchableOpacity>
        </View>
        {load ? (
          <View style={HomeStyle.HomeContentContainer}>
            <Image
              source={require("../assets/Images/loader-1.gif")}
              style={{
                height: moderateScale(100),
                width: moderateScale(100),
              }}
            />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
            }}
            style={{ flex: 1, width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {dataload && (
              <Animatable.Image
                source={require("../assets/Images/Data-Transfer.gif")}
                resizeMode="contain"
                style={{
                  width: moderateScale(100),
                  height: moderateScale(100),
                }}
                animation={"fadeInDown"}
              />
            )}
            {dailyreport?.getDailyAttendanceReport.map(
              (attendance: any, index: number) => (
                <Animatable.View
                  style={[
                    DailyAttendanceStyle.DailyAttBodyMiniContainer,
                    {
                      paddingVertical: moderateScale(10),
                      borderBottomWidth: moderateScale(1),
                    },
                  ]}
                  key={index}
                >
                  <View style={DailyAttendanceStyle.DailyAttCardContainer}>
                    <View style={DailyAttendanceStyle.DailyAttCardLeft}>
                      {/* <ImageWithLoading uri={attendance?.profileImage} /> */}
                      <Image
                        source={
                          attendance?.profileImage
                            ? { uri: attendance?.profileImage }
                            : require("../assets/Images/user_phoem.jpg")
                        }
                        style={[
                          DailyAttendanceStyle.DailyAttCardImg,
                          {
                            height: moderateScale(40),
                            width: moderateScale(40),
                            borderWidth: moderateScale(1),
                          },
                        ]}
                      />
                      <View
                        style={[
                          DailyAttendanceStyle.DailyAttCardTitleCon,
                          { paddingLeft: moderateScale(10) },
                        ]}
                      >
                        <Text
                          style={[
                            DailyAttendanceStyle.DailyAttCardTitle1,
                            { fontSize: moderateScale(14) },
                          ]}
                        >
                          {attendance?.latinName}
                        </Text>
                        <Text
                          style={[
                            DailyAttendanceStyle.DailyAttCardTitle2,
                            { fontSize: moderateScale(12) },
                          ]}
                        >
                          {attendance?.reason ? attendance?.reason : "--:--"}
                        </Text>
                      </View>
                    </View>
                    <View style={DailyAttendanceStyle.DailyAttCardRight}>
                      <Text
                        style={[
                          DailyAttendanceStyle.DailyAttCardTitle3,
                          {
                            fontSize: moderateScale(12),
                            color:
                              attendance?.attendance === "Absence"
                                ? "red"
                                : attendance?.attendance === "Late"
                                ? "orange"
                                : "green",
                          },
                        ]}
                      >
                        {attendance?.attendance}
                      </Text>
                    </View>
                  </View>
                </Animatable.View>
              )
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
