import { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useLocation, useNavigate } from "react-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@apollo/client";
import ImageView from "react-native-image-viewing";
import getAppVersion from "../getAppVersion";
import Constants from "expo-constants";
import ProfileStyle from "../styles/ProfileStyle.scss";
import ModalStyle from "../styles/ModalStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import auth from "../Auth/auth";
import useLoginUser from "../Hook/useLoginUser";
import { GET_USER_INFO } from "../graphql/GetUserInfo";
import * as Animatable from "react-native-animatable";
import SwiperPage from "../includes/SwiperPage";
import { moderateScale } from "../ Metrics";
import { AppVersions } from "../functions/FetchDataLocalStorage";

export default function ProfileScreen() {
  const location = useLocation();
  const { dimension } = useContext(AuthContext);
  const [isVisible, setVisible] = useState(false);
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

  const handleCloseModal = () => {
    setVisible(false);
  };
  const [visible, setIsVisible] = useState(false);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const navigate = useNavigate();
  const { dispatch, REDUCER_ACTIONS } = useLoginUser();

  const Logouthandle = async () => {
    await auth.logout().then(async (result) => {
      await AsyncStorage.removeItem("@userToken");
      await AsyncStorage.removeItem("@userUid");
      dispatch({
        type: REDUCER_ACTIONS.LOGOUT,
      });
      navigate("/");
    });
  };

  const { data, refetch } = useQuery(GET_USER_INFO, {
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (err) => {
      console.log(err?.message);
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const handlePress = async () => {
    const urlPlaystore =
      "https://play.google.com/store/apps/details?id=com.goglobalschool.humanresource&hl=en_US";
    const urlAppstore =
      "https://apps.apple.com/us/app/go-global-human-resource/id6447095814";
    // Checking if the link is supported for opening
    const supportedPlay = await Linking.canOpenURL(urlPlaystore);
    const supportedApp = await Linking.canOpenURL(urlAppstore);

    if (supportedPlay && Platform.OS === "android") {
      // Opening the link in the default web browser
      await Linking.openURL(urlPlaystore);
    } else if (supportedApp && Platform.OS === "ios") {
      // Opening the link in the default web browser
      await Linking.openURL(urlAppstore);
    } else {
      console.log(
        `Don't know how to open this URL:  ${
          Platform.OS === "ios" ? urlAppstore : urlPlaystore
        }`
      );
    }
  };

  return (
    <>
      <View style={ProfileStyle.ProfileContainer}>
        <SwiperPage path="/home" page="profile" isScrolling={false}>
          <View
            style={{
              width: "100%",
              height: "70%",
              position: "absolute",
              backgroundColor: "white",
            }}
          />
          <View style={ProfileStyle.ProfileTopContainer}>
            <View style={ProfileStyle.ProfileFirstTopContainer} />
            <View
              style={[
                ProfileStyle.ProfileSecondTopContainer,
                {
                  borderTopLeftRadius: moderateScale(20),
                  borderTopRightRadius: moderateScale(20),
                  // borderTopWidth: moderateScale(1),
                  // borderLeftWidth: moderateScale(1),
                  // borderRightWidth: moderateScale(1),
                },
              ]}
            >
              <Text
                style={[ProfileStyle.UserName, { fontSize: moderateScale(14) }]}
              >
                {data?.getUserInfoMobile?.latinName
                  ? data?.getUserInfoMobile?.latinName
                  : "--:--"}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              style={{ position: "absolute" }}
              onPress={() => {
                if (data?.getUserInfoMobile?.profileImage) {
                  setIsVisible(true);
                }
              }}
            >
              <Animatable.Image
                animation={"fadeIn"}
                resizeMode="cover"
                source={
                  data?.getUserInfoMobile?.profileImage
                    ? { uri: data?.getUserInfoMobile?.profileImage }
                    : require("../assets/Images/user.png")
                }
                style={[
                  ProfileStyle.ImageUser,
                  {
                    width: moderateScale(100),
                    height: moderateScale(100),
                    borderWidth: moderateScale(2),
                  },
                ]}
              />
            </TouchableOpacity>

            <ImageView
              images={[
                data?.getUserInfoMobile?.profileImage
                  ? {
                      uri: data?.getUserInfoMobile?.profileImage,
                    }
                  : require("../assets/Images/user.png"),
              ]}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </View>
          <View
            style={[
              ProfileStyle.ProfileBodyContainer,
              {
                borderRightWidth: moderateScale(1),
                borderLeftWidth: moderateScale(1),
              },
            ]}
          >
            <View>
              <Text
                style={[
                  ProfileStyle.UserPosition,
                  {
                    fontSize: moderateScale(12),
                    lineHeight: moderateScale(35),
                  },
                ]}
              >
                Position:{" "}
                {data?.getUserInfoMobile?.position
                  ? data?.getUserInfoMobile?.position
                  : "--:--"}
              </Text>
            </View>
            {Platform.OS === "ios" && LocalVersion && versions ? (
              LocalVersion < versions?.appStoreVersion ? (
                <TouchableOpacity onPress={handlePress}>
                  <Text
                    style={[
                      ProfileStyle.UserPosition,
                      {
                        fontSize: moderateScale(12),
                        lineHeight: moderateScale(35),
                        color: "blue",
                      },
                    ]}
                  >
                    Check for update {">>>"}
                  </Text>
                </TouchableOpacity>
              ) : null
            ) : LocalVersion &&
              versions &&
              LocalVersion < versions?.playStoreVersion ? (
              <TouchableOpacity onPress={handlePress}>
                <Text
                  style={[
                    ProfileStyle.UserPosition,
                    {
                      fontSize: moderateScale(12),
                      lineHeight: moderateScale(35),
                      color: "blue",
                    },
                  ]}
                >
                  Check for update {">>>"}
                </Text>
              </TouchableOpacity>
            ) : null}

            <View style={ProfileStyle.LogoutContainer}>
              <View
                style={{
                  flex: 1,
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  // backgroundColor: "#f1f1f1",
                  borderRadius: moderateScale(15),
                }}
              >
                {/* <Text
                  style={[
                    ProfileStyle.UserName,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Empty
                </Text> */}
              </View>

              <TouchableOpacity
                style={[
                  ProfileStyle.LogoutScreenLogoutButton,
                  {
                    borderRadius: moderateScale(10),
                    padding: moderateScale(10),
                    marginVertical: moderateScale(10),
                  },
                ]}
                onPress={() => {
                  handleOpenModal();
                }}
              >
                <Text
                  style={[
                    ProfileStyle.LogoutScreenLogoutButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SwiperPage>
      </View>
      {/* ========================START MODAL ALERT============================ */}
      <Modal
        visible={isVisible}
        animationType="none"
        onRequestClose={handleCloseModal}
        transparent={true}
      >
        <View style={ModalStyle.ModalContainer}>
          <TouchableOpacity
            style={ModalStyle.ModalBackgroundOpacity}
            onPress={handleCloseModal}
            activeOpacity={0.2}
          />
          <View
            style={[
              ModalStyle.ModalButtonContainerMain,
              {
                height: moderateScale(200),
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
              },
            ]}
          >
            <View
              style={[
                ModalStyle.ModalButtonTextTitleContainerMain,
                { padding: moderateScale(20) },
              ]}
            >
              <Text
                style={[
                  ModalStyle.ModalButtonTextTitleMain,
                  { fontSize: moderateScale(16) },
                ]}
              >
                Do you want to logout?
              </Text>
            </View>

            <View style={ModalStyle.ModalButtonOptionContainer}>
              <TouchableOpacity
                onPress={() => handleCloseModal()}
                style={[
                  ModalStyle.ModalButtonOptionLeft,
                  {
                    padding: moderateScale(15),
                    borderTopWidth: moderateScale(1),
                  },
                ]}
              >
                <Text
                  style={[
                    ModalStyle.ModalButtonTextTitleMain,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCloseModal();
                  Logouthandle();
                }}
                style={[
                  ModalStyle.ModalButtonOptionLeft,
                  {
                    padding: moderateScale(15),
                    borderLeftWidth: moderateScale(1),
                    borderTopWidth: moderateScale(1),
                  },
                ]}
              >
                <Text
                  style={[
                    ModalStyle.ModalButtonTextTitleMain,
                    { fontSize: moderateScale(16) },
                  ]}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* ========================START MODAL ALERT============================ */}
    </>
  );
}
