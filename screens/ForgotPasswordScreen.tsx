import { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigate } from "react-router";
import { useLazyQuery } from "@apollo/client";
import LoginStyle from "../styles/LoginStyle.scss";
import ForgotPasswordStyle from "../styles/ForgotPasswordStyle.scss";
import { AuthContext } from "../Context/AuthContext";
import { FORGOT_PASSWORD } from "../graphql/ForgotPassword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moderateScale } from "../ Metrics";
import moment from "moment";

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

  const [validateEmailStatus, setValidateEmailStatus] = useState(false);

  const handleCheckValidate = (text: string) => {
    let reg: any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      // console.log("Email is Not Correct");
      setValidateEmailStatus(true);
      setEmail(text);
      return false;
    } else {
      setEmail(text);
      setValidateEmailStatus(false);
      // console.log("Email is Correct");
    }
  };

  useEffect(() => {
    async function getAccount() {
      let userGmail = await AsyncStorage.getItem("@gmail");
      // console.log(userGmail + "\n" + userPassword);
      if (userGmail) {
        handleCheckValidate(userGmail);
      }
    }
    getAccount();
  }, []);

  return (
    <View style={ForgotPasswordStyle.ForgotPassScreenContainer}>
      {!isKeyboardVisible ? (
        <View style={ForgotPasswordStyle.ForgotTopcontainer}>
          <View
            style={[
              ForgotPasswordStyle.LogoImageScreenContainer,
              {
                height: "70%",
                justifyContent: "flex-end",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={require("../assets/Images/Logo-1.png")}
              resizeMode="contain"
              style={{
                height: moderateScale(130),
                width: moderateScale(130),
                borderRadius: 100,
              }}
            />
          </View>
          <Text
            style={[
              ForgotPasswordStyle.ForgotScreenTitle1,
              { fontSize: moderateScale(20) },
            ]}
          >
            Welcome Back!
          </Text>
        </View>
      ) : null}

      {/* {isKeyboardVisible ? (
          <View style={{ height: dimension === "sm" ? 10 : 20 }} />
        ) : null} */}

      <View
        style={{
          width: "100%",
          height: "45%",
          alignItems: "center",
          marginTop: isKeyboardVisible ? moderateScale(50) : 0,
        }}
      >
        <View
          style={[
            ForgotPasswordStyle.ForgotTextInputContainer,
            {
              marginTop: moderateScale(10),
              borderWidth: moderateScale(2),
              padding: moderateScale(15),
              borderRadius: moderateScale(10),
            },
          ]}
        >
          <Text
            style={[
              ForgotPasswordStyle.ForgotScreenTextInputText,
              { fontSize: moderateScale(14) },
            ]}
          >
            Email*
          </Text>
          <View
            style={[
              ForgotPasswordStyle.ForgotScreenTextInputBox,
              {
                borderWidth: moderateScale(1),
                borderRadius: moderateScale(10),
                padding: moderateScale(10),
                marginTop: moderateScale(10),
              },
            ]}
          >
            <TextInput
              value={email}
              placeholder="mail@gmail.com"
              style={[
                ForgotPasswordStyle.ForgotScreenTextInputText,
                { fontSize: moderateScale(14) },
              ]}
              onChangeText={(e) => {
                const updatedText = e.replace(/\s/g, "");
                handleCheckValidate(updatedText);
              }}
              keyboardType="default"
              secureTextEntry={false}
            />
          </View>
          {validateEmailStatus === true ? (
            <Text
              style={[
                LoginStyle.LoginRequireScreenTextInputText,
                { fontSize: moderateScale(12) },
              ]}
            >
              Oop!, invalid email
            </Text>
          ) : null}
          <View style={ForgotPasswordStyle.ForgotScreenBtnContainer}>
            <TouchableOpacity
              style={[
                ForgotPasswordStyle.ForgotScreenForgotButtonBack,
                {
                  borderRadius: moderateScale(10),
                  padding: moderateScale(10),
                  marginTop: moderateScale(10),
                },
              ]}
              onPress={() => navigate("/")}
            >
              <Text
                style={[
                  ForgotPasswordStyle.ForgotScreenForgotButtonText,
                  { fontSize: moderateScale(14) },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
            {loadingPage ? (
              <TouchableOpacity
                style={ForgotPasswordStyle.ForgotScreenForgotButton}
              >
                <Text
                  style={[
                    ForgotPasswordStyle.ForgotScreenForgotButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Loading...
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  ForgotPasswordStyle.ForgotScreenForgotButton,
                  {
                    borderRadius: moderateScale(10),
                    padding: moderateScale(10),
                    marginTop: moderateScale(10),
                  },
                ]}
                onPress={() => {
                  handleSendEmail();
                }}
              >
                <Text
                  style={[
                    ForgotPasswordStyle.ForgotScreenForgotButtonText,
                    { fontSize: moderateScale(14) },
                  ]}
                >
                  Ok
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {!isKeyboardVisible ? (
        <View style={LoginStyle.LoginScreenFooterContainer}>
          {/* <Image
           source={require("../assets/Images/bottomImage.png")}
           style={LoginStyle.LoginScreenFooterImage}
           resizeMode="contain"
         /> */}
          <Text
            style={[
              LoginStyle.LoginScreenText1,
              { fontSize: moderateScale(14) },
            ]}
          >
            © {moment(new Date()).format("YYYY")} Go Global School.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
