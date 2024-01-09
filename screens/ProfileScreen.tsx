import { useState, useContext, useEffect } from "react";
import { Text, View, Image, Modal, TouchableOpacity } from "react-native";
import { useLocation, useNavigate } from "react-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@apollo/client";
import ImageView from "react-native-image-viewing";

import ProfileStyle from "../styles/ProfileStyle.scss";
import ModalStyle from "../styles/ModalStyle.scss";

import { AuthContext } from "../Context/AuthContext";
import auth from "../Auth/auth";
import useLoginUser from "../Hook/useLoginUser";
import { GET_USER_INFO } from "../graphql/GetUserInfo";
import * as Animatable from "react-native-animatable";
import SwiperPage from "../includes/SwiperPage";

export default function ProfileScreen() {
  const location = useLocation();
  const { dimension } = useContext(AuthContext);
  const [isVisible, setVisible] = useState(false);
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

  return (
    <>
      <View style={ProfileStyle.ProfileContainer}>
        <View
          style={{
            width: "100%",
            height: "85%",
            position: "absolute",
          }}
        />
        <SwiperPage path="/home" page="profile" isScrolling={false}>
          <View style={ProfileStyle.ProfileTopContainer}>
            <View style={ProfileStyle.ProfileFirstTopContainer} />
            <View style={ProfileStyle.ProfileSecondTopContainer}>
              <Text
                style={
                  dimension === "sm"
                    ? ProfileStyle.UserNameSM
                    : ProfileStyle.UserName
                }
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
                source={
                  data?.getUserInfoMobile?.profileImage
                    ? { uri: data?.getUserInfoMobile?.profileImage }
                    : require("../assets/Images/user.png")
                }
                style={
                  dimension === "sm"
                    ? ProfileStyle.ImageUserSM
                    : ProfileStyle.ImageUser
                }
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
          <View style={ProfileStyle.ProfileBodyContainer}>
            <View>
              <Text
                style={
                  dimension === "sm"
                    ? ProfileStyle.UserPositionSM
                    : ProfileStyle.UserPosition
                }
              >
                Position:{" "}
                {data?.getUserInfoMobile?.position
                  ? data?.getUserInfoMobile?.position
                  : "--:--"}
              </Text>
            </View>
            <View style={ProfileStyle.LogoutContainer}>
              <View
                style={{
                  flex: 1,
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f1f1f1",
                  borderRadius: 15,
                }}
              >
                <Text
                  style={
                    dimension === "sm"
                      ? ProfileStyle.UserNameSM
                      : ProfileStyle.UserName
                  }
                >
                  Empty
                </Text>
              </View>

              <TouchableOpacity
                style={
                  dimension === "sm"
                    ? ProfileStyle.LogoutScreenLogoutButtonSM
                    : ProfileStyle.LogoutScreenLogoutButton
                }
                onPress={() => {
                  handleOpenModal();
                }}
              >
                <Text
                  style={
                    dimension === "sm"
                      ? ProfileStyle.LogoutScreenLogoutButtonTextSM
                      : ProfileStyle.LogoutScreenLogoutButtonText
                  }
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
          <View style={ModalStyle.ModalButtonContainerMain}>
            <View style={ModalStyle.ModalButtonTextTitleContainerMain}>
              <Text
                style={
                  dimension === "sm"
                    ? ModalStyle.ModalButtonTextTitleMainSM
                    : ModalStyle.ModalButtonTextTitleMain
                }
              >
                Do you want to logout?
              </Text>
            </View>

            <View style={ModalStyle.ModalButtonOptionContainer}>
              <TouchableOpacity
                onPress={() => handleCloseModal()}
                style={ModalStyle.ModalButtonOptionLeft}
              >
                <Text
                  style={
                    dimension === "sm"
                      ? ModalStyle.ModalButtonTextTitleMainSM
                      : ModalStyle.ModalButtonTextTitleMain
                  }
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
                  { borderLeftWidth: 1 },
                ]}
              >
                <Text
                  style={
                    dimension === "sm"
                      ? ModalStyle.ModalButtonTextTitleMainSM
                      : ModalStyle.ModalButtonTextTitleMain
                  }
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
