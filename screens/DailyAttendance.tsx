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
          style={
            dimension === "sm"
              ? DailyAttendanceStyle.DailyAttCardImgSM
              : DailyAttendanceStyle.DailyAttCardImg
          }
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
            numberOfLines={1}
            style={
              dimension === "sm"
                ? DailyAttendanceStyle.DailyAttBackButtonTitleSM
                : DailyAttendanceStyle.DailyAttBackButtonTitle
            }
          >
            DAIILY ATTENDANCES
          </Text>
        </TouchableOpacity>
      </View>
      <View style={DailyAttendanceStyle.DailyAttBodyContainer}>
        <View style={DailyAttendanceStyle.CheckMainSelectDateSection}>
          <View style={{ flexDirection: "row", flex: 1 }}>
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
              <View>
                <Text
                  style={
                    dimension === "sm"
                      ? DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholderSM
                      : DailyAttendanceStyle.DailyAttMainSelectDateButtonPlaceholder
                  }
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
              style={{ height: 100, width: 100 }}
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
                style={{ width: 100, height: 100 }}
                animation={"fadeInDown"}
              />
            )}
            {dailyreport?.getDailyAttendanceReport.map(
              (attendance: any, index: number) => (
                <Animatable.View
                  style={DailyAttendanceStyle.DailyAttBodyMiniContainer}
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
                        style={
                          dimension === "sm"
                            ? DailyAttendanceStyle.DailyAttCardImgSM
                            : DailyAttendanceStyle.DailyAttCardImg
                        }
                      />
                      <View style={DailyAttendanceStyle.DailyAttCardTitleCon}>
                        <Text
                          style={
                            dimension === "sm"
                              ? DailyAttendanceStyle.DailyAttCardTitle1SM
                              : DailyAttendanceStyle.DailyAttCardTitle1
                          }
                        >
                          {attendance?.latinName}
                        </Text>
                        <Text
                          style={
                            dimension === "sm"
                              ? DailyAttendanceStyle.DailyAttCardTitle2SM
                              : DailyAttendanceStyle.DailyAttCardTitle2
                          }
                        >
                          {attendance?.reason ? attendance?.reason : "--:--"}
                        </Text>
                      </View>
                    </View>
                    <View style={DailyAttendanceStyle.DailyAttCardRight}>
                      <Text
                        style={[
                          dimension === "sm"
                            ? DailyAttendanceStyle.DailyAttCardTitle3SM
                            : DailyAttendanceStyle.DailyAttCardTitle3,
                          {
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
