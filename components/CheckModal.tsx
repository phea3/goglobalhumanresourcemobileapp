import { Image, Modal, Text, TouchableOpacity } from "react-native";
import ModalStyle from "../styles/ModalStyle.scss";
import { View } from "react-native-animatable";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-native";

export default function CheckModal({
  location,
  isVisible,
  handleClose,
  data,
  load,
}: any) {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);

  // console.log(data);
  useEffect(() => {
    if (data?.status === true) {
      setTimeout(() => {
        navigate("/attendance");
      }, 500);
    }
  }, [data?.status]);

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      onRequestClose={handleClose}
      transparent={true}
    >
      <View style={ModalStyle.ModalContainer}>
        <TouchableOpacity
          style={ModalStyle.ModalBackgroundOpacity}
          // onPress={() => {
          //   handleClose();
          // }}
          activeOpacity={0.2}
        />
        <View
          style={
            data?.status === true
              ? ModalStyle.ModalButtonContainer
              : ModalStyle.ModalButtonContainerFail
          }
        >
          <Image
            source={
              load
                ? require("../assets/Images/loader-1.gif")
                : data?.status === null
                ? require("../assets/Images/cross-outline.gif")
                : data?.status === true
                ? require("../assets/Images/check-outline.gif")
                : require("../assets/Images/cross-outline.gif")
            }
            style={
              dimension === "sm"
                ? ModalStyle.ModalImageAfterCheckSM
                : ModalStyle.ModalImageAfterCheck
            }
          />
          <Text
            style={
              dimension === "sm"
                ? ModalStyle.ModalButtonTextTitleSM
                : ModalStyle.ModalButtonTextTitle
            }
          >
            {load
              ? "Loading"
              : data?.status === null
              ? "Can't get your location."
              : data?.status === true
              ? "Success!"
              : "Fail!"}
          </Text>
          <Text
            style={
              dimension === "sm"
                ? ModalStyle.ModalButtonTextBodySM
                : ModalStyle.ModalButtonTextBody
            }
          >
            {load
              ? `Getting your current location. \n please wait... \n it's depend on your device.`
              : data?.status === null
              ? "Please try again."
              : data
              ? data?.message
              : ""}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
