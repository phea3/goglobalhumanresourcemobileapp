import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "../styles/HeaderStyle.scss";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import {
  fetchDataLocalStorage,
  initMobileUserLogin,
} from "../functions/FetchDataLocalStorage";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";
import getAppVersion from "../getAppVersion";
import Constants from "expo-constants";
import { AppVersions } from "../functions/FetchDataLocalStorage";

export default function Header() {
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);

  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [versions, setVersions] = useState<AppVersions | null>(null);
  const LocalVersion = Constants.expoConfig?.version;
  useEffect(() => {
    const fetchAppVersion = async () => {
      const appVersions = await getAppVersion();
      if (appVersions) {
        setVersions(appVersions);
      }
    };

    fetchAppVersion();
    // console.log(versions);
    // console.log(LocalVersion);
  }, [getAppVersion]);

  useMemo(() => {
    fetchDataLocalStorage("@mobileUserLogin").then((value) => {
      let mobileUser: string = value;
      let mobileUserLoginData = JSON.parse(mobileUser);
      // console.log(mobileUserLoginData);
      setMobileUserLogin({
        _id: mobileUserLoginData?.user?._id,
        firstName: mobileUserLoginData?.user?.firstName,
        lastName: mobileUserLoginData?.user?.lastName,
        englishName: mobileUserLoginData?.user?.latinName,
        profileImg: mobileUserLoginData?.user?.profileImage,
        role: mobileUserLoginData?.user?.role,
      });
    });
  }, [location.pathname]);

  if (location.pathname === "/load") {
    return null;
  }

  // console.log(location.pathname);

  return (
    <View style={HeaderStyle.HeaderContainer}>
      <View style={HeaderStyle.HeaderInSideContainer}>
        {location.pathname === "/notification/action" ||
        location.pathname === "/notification/meeting" ||
        location.pathname === "/notification" ? (
          <View style={HeaderStyle.HeaderLeftFullSideContainer}>
            <TouchableOpacity
              style={
                dimension === "sm"
                  ? HeaderStyle.HeaderLeftSideContainerSM
                  : HeaderStyle.HeaderLeftSideContainer
              }
              onPress={() => {
                navigate("/home");
              }}
            >
              <Image
                source={require("../assets/Images/back-blue.png")}
                style={{
                  width: moderateScale(22),
                  height: moderateScale(22),
                  margin: moderateScale(8),
                }}
              />
              <View style={{ padding: moderateScale(5) }}>
                <Text
                  style={[
                    HeaderStyle.HeaderTitle1Blue,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  NOTIFICATIONS
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {location.pathname === "/profile" ? (
              <View
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderLeftSideContainerSM
                    : HeaderStyle.HeaderLeftSideContainer
                }
              >
                <TouchableOpacity
                  onPress={() => navigate(-1)}
                  style={[
                    HeaderStyle.ProfileBackButton,
                    { padding: moderateScale(10) },
                  ]}
                >
                  <Image
                    source={require("../assets/Images/back-white.png")}
                    style={{
                      width: moderateScale(20),
                      height: moderateScale(20),
                      marginRight: moderateScale(10),
                    }}
                  />
                  <Text
                    style={[
                      HeaderStyle.ProfileBackButtonTitle,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    PROFILE
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => navigate("/profile")}
              style={{
                display: location.pathname === "/profile" ? "none" : "flex",
              }}
            >
              <View
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderLeftSideContainerSM
                    : HeaderStyle.HeaderLeftSideContainer
                }
              >
                <Image
                  source={
                    mobileUserLogin?.profileImg
                      ? { uri: mobileUserLogin?.profileImg }
                      : require("../assets/Images/user.png")
                  }
                  style={[
                    HeaderStyle.HeaderUserProfileImage,
                    {
                      height: moderateScale(40),
                      width: moderateScale(40),
                      margin: moderateScale(8),
                    },
                  ]}
                  resizeMode="cover"
                />
                <View
                  style={[
                    HeaderStyle.HeaderTitleContainer,
                    { height: moderateScale(40) },
                  ]}
                >
                  <Text
                    style={[
                      HeaderStyle.HeaderTitle1,
                      { fontSize: moderateScale(14) },
                    ]}
                  >
                    Hi {mobileUserLogin?.englishName}!
                  </Text>
                  <Text
                    style={[
                      HeaderStyle.HeaderTitle2,
                      { fontSize: moderateScale(12) },
                    ]}
                  >
                    View Profile{" >"}
                  </Text>
                  <Text
                    style={[
                      {
                        fontSize: moderateScale(10),
                        fontFamily: "Century-Gothic",
                        color:
                          LocalVersion && versions
                            ? LocalVersion < versions?.appStoreVersion
                              ? "orange"
                              : "#66FF66"
                            : "white",
                      },
                    ]}
                  >
                    {Platform.OS === "ios" && LocalVersion && versions
                      ? LocalVersion < versions?.appStoreVersion
                        ? "Need update!!!"
                        : "Up to date."
                      : LocalVersion &&
                        versions &&
                        LocalVersion < versions?.playStoreVersion
                      ? "Need update!!!"
                      : "Up to date."}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}
        {location.pathname === "/notification" ||
        location.pathname === "/notification/action" ||
        location.pathname === "/notification/meeting" ||
        location.pathname === "/profile" ? null : (
          <TouchableOpacity
            style={HeaderStyle.HeaderRightSideContainer}
            onPress={() => navigate("/notification")}
          >
            <Image
              source={require("../assets/Images/bell.png")}
              resizeMode="contain"
              style={{
                height: moderateScale(30),
                width: moderateScale(30),
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
