import { Image, Text, TouchableOpacity, View } from "react-native";
import HeaderStyle from "../styles/HeaderStyle.scss";
import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import {
  fetchDataLocalStorage,
  initMobileUserLogin,
} from "../functions/FetchDataLocalStorage";
import { horizontalScale, moderateScale, verticalScale } from "../ Metrics";

export default function Header() {
  const [mobileUserLogin, setMobileUserLogin] = useState(initMobileUserLogin);

  const { dimension } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

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
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderBackIconSM
                    : HeaderStyle.HeaderBackIcon
                }
              />
              <View
                style={
                  dimension === "sm"
                    ? HeaderStyle.HeaderTitleNotiContainerSM
                    : HeaderStyle.HeaderTitleNotiContainer
                }
              >
                <Text
                  style={
                    dimension === "sm"
                      ? HeaderStyle.HeaderTitle1BlueSM
                      : HeaderStyle.HeaderTitle1Blue
                  }
                >
                  Notifications
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
                  style={HeaderStyle.ProfileBackButton}
                >
                  <Image
                    source={require("../assets/Images/back-white.png")}
                    style={HeaderStyle.ProfileBackButtonIcon}
                  />
                  <Text style={HeaderStyle.ProfileBackButtonTitle}>
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
                      height: horizontalScale(40),
                      width: horizontalScale(40),
                      margin: horizontalScale(8),
                    },
                  ]}
                  resizeMode="contain"
                />
                <View
                  style={[
                    HeaderStyle.HeaderTitleContainer,
                    { height: horizontalScale(40) },
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
                height: horizontalScale(30),
                width: horizontalScale(30),
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
