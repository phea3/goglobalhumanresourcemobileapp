import { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  Keyboard,
  Alert,
  Modal,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigate } from "react-router";
import { useLazyQuery } from "@apollo/client";
import LoginStyle from "../styles/LoginStyle.scss";
import ForgotPasswordStyle from "../styles/ForgotPasswordStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import { FORGOT_PASSWORD } from "../graphql/ForgotPassword";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { dimension } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);

  const [getToForgotPass] = useLazyQuery(FORGOT_PASSWORD, {
    onCompleted({ forgortUserPassword }) {
      // console.log(forgortUserPassword);
      Alert.alert(
        forgortUserPassword?.title,
        forgortUserPassword?.description,
        [
          {
            text: "Okey",
            onPress: () =>
              forgortUserPassword?.status
                ? navigate("/")
                : navigate("/forgot-pass"),
          },
        ]
      );
      setLoadingPage(false);
    },
    onError(error) {
      if (
        email.includes("@gmail.com") &&
        email !== "" &&
        email.indexOf(" ") === -1
      ) {
        // console.log(error?.message);
        Alert.alert("Message", error?.message);
        setLoadingPage(false);
      }
    },
  });

  const handleSendEmail = () => {
    if (
      email.includes("@gmail.com") &&
      email !== "" &&
      email.indexOf(" ") === -1
    ) {
      setLoadingPage(true);
      getToForgotPass({
        variables: {
          email: email,
        },
      });
    }
  };
  // console.log("email::", email);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={ForgotPasswordStyle.ForgotPassScreenContainer}>
      <View style={ForgotPasswordStyle.ForgotTopcontainer}>
        {!isKeyboardVisible ? (
          <View
            style={
              dimension === "sm"
                ? ForgotPasswordStyle.LogoImageScreenContainerSm
                : ForgotPasswordStyle.LogoImageScreenContainer
            }
          >
            <Image
              style={
                dimension === "sm"
                  ? ForgotPasswordStyle.LogoImageSm
                  : ForgotPasswordStyle.LogoImage
              }
              source={require("../assets/Images/Logo-1.png")}
              resizeMode="contain"
            />
          </View>
        ) : null}

        {/* {isKeyboardVisible ? (
          <View style={{ height: dimension === "sm" ? 10 : 20 }} />
        ) : null} */}

        <Text
          style={
            dimension === "sm"
              ? ForgotPasswordStyle.ForgotScreenTitle1Sm
              : ForgotPasswordStyle.ForgotScreenTitle1
          }
        >
          Welcome Back!
        </Text>
        <Text
          style={
            dimension === "sm"
              ? ForgotPasswordStyle.ForgotScreenTitle2Sm
              : ForgotPasswordStyle.ForgotScreenTitle2
          }
        >
          Go Global HR
        </Text>

        <View
          style={
            dimension === "sm"
              ? ForgotPasswordStyle.ForgotTextInputContainerSm
              : ForgotPasswordStyle.ForgotTextInputContainer
          }
        >
          <Text
            style={
              dimension === "sm"
                ? ForgotPasswordStyle.ForgotScreenTextInputTextSM
                : ForgotPasswordStyle.ForgotScreenTextInputText
            }
          >
            Email*
          </Text>
          <View
            style={
              dimension === "sm"
                ? ForgotPasswordStyle.ForgotScreenTextInputBoxSM
                : ForgotPasswordStyle.ForgotScreenTextInputBox
            }
          >
            <TextInput
              value={email}
              placeholder="mail@gmail.com"
              style={
                dimension === "sm"
                  ? ForgotPasswordStyle.ForgotScreenTextInputTextSM
                  : ForgotPasswordStyle.ForgotScreenTextInputText
              }
              onChangeText={(e) => {
                const updatedText = e.replace(/\s/g, "");
                setEmail(updatedText);
              }}
              keyboardType="default"
              secureTextEntry={false}
            />
          </View>
          {email === "" ? (
            <Text
              style={
                dimension === "sm"
                  ? LoginStyle.LoginRequireScreenTextInputTextSM
                  : LoginStyle.LoginRequireScreenTextInputText
              }
            >
              Required!
            </Text>
          ) : email.indexOf(" ") !== -1 ? (
            <Text
              style={
                dimension === "sm"
                  ? LoginStyle.LoginRequireScreenTextInputTextSM
                  : LoginStyle.LoginRequireScreenTextInputText
              }
            >
              Invalid email!, email cannot contain spaces
            </Text>
          ) : email.includes("@gmail.com") ? null : (
            <Text
              style={
                dimension === "sm"
                  ? LoginStyle.LoginRequireScreenTextInputTextSM
                  : LoginStyle.LoginRequireScreenTextInputText
              }
            >
              Oop!, invalid email
            </Text>
          )}
          <View style={ForgotPasswordStyle.ForgotScreenBtnContainer}>
            <TouchableOpacity
              style={
                dimension === "sm"
                  ? ForgotPasswordStyle.ForgotScreenForgotButtonBackSM
                  : ForgotPasswordStyle.ForgotScreenForgotButtonBack
              }
              onPress={() => navigate("/")}
            >
              <Text
                style={
                  dimension === "sm"
                    ? ForgotPasswordStyle.ForgotScreenForgotButtonTextSM
                    : ForgotPasswordStyle.ForgotScreenForgotButtonText
                }
              >
                Back
              </Text>
            </TouchableOpacity>
            {loadingPage ? (
              <TouchableOpacity
                style={
                  dimension === "sm"
                    ? ForgotPasswordStyle.ForgotScreenForgotButtonSM
                    : ForgotPasswordStyle.ForgotScreenForgotButton
                }
              >
                <Text
                  style={
                    dimension === "sm"
                      ? ForgotPasswordStyle.ForgotScreenForgotButtonTextSM
                      : ForgotPasswordStyle.ForgotScreenForgotButtonText
                  }
                >
                  Loading...
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={
                  dimension === "sm"
                    ? ForgotPasswordStyle.ForgotScreenForgotButtonSM
                    : ForgotPasswordStyle.ForgotScreenForgotButton
                }
                onPress={() => {
                  handleSendEmail();
                }}
              >
                <Text
                  style={
                    dimension === "sm"
                      ? ForgotPasswordStyle.ForgotScreenForgotButtonTextSM
                      : ForgotPasswordStyle.ForgotScreenForgotButtonText
                  }
                >
                  Ok
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {!isKeyboardVisible ? (
        <View style={ForgotPasswordStyle.ForgotBottomContainer}>
          <Image
            source={require("../assets/Images/bottomImage.png")}
            style={
              dimension === "sm"
                ? ForgotPasswordStyle.ForgotScreenFooterImage
                : ForgotPasswordStyle.ForgotScreenFooterImage
            }
            resizeMode="contain"
          />
        </View>
      ) : null}
    </View>
  );
}
