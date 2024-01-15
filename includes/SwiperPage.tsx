import { Animated, Easing, Platform, Text, View } from "react-native";
import {
  PanGestureHandler,
  State,
  Swipeable,
} from "react-native-gesture-handler";
import { useNavigate } from "react-router-native";

interface SwiperPageProps {
  children: React.ReactNode;
  path: string;
  page: string;
  isScrolling: boolean;
}

export default function SwiperPage({
  children,
  path,
  page,
  isScrolling,
}: SwiperPageProps): React.JSX.Element {
  const navigate = useNavigate();
  // Define animated values and handlers
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
        },
      },
    ],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // You can perform actions when the swipe ends here
      // For example, navigate to the next screen if swiped enough
      if (event.nativeEvent.translationX > -100) {
        // Perform navigation or any other action
        // console.log("Swiped left, perform action");
        if (event.nativeEvent.translationX > 180) {
          // console.log(event.nativeEvent.translationX);
          navigate(path);
        }
      }
      // Reset the translation value
      translateX.setValue(0);
    }
  };

  // Use Animated.timing for continuous updates outside gesture context
  const updateTranslationX = () => {
    Animated.timing(translateX, {
      toValue: 0, // Reset value to 0 when negative
      duration: 100000, // Adjust the duration as needed
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };
  updateTranslationX();
  // Call the updateTranslationX function periodically (for example, every 500ms)
  setInterval(updateTranslationX, 1000);

  const onNavigate = (event: any) => {
    const swipeLength = event.nativeEvent.translationX;
    // console.log("Navigating with swipe length:", swipeLength);
    // Your custom action when swiped left

    if (event.nativeEvent.translationX > 180) {
      // console.log(event.nativeEvent.translationX);
      navigate(path);
    }
  };
  const onSwipeableLeftOpen = () => {
    // Your custom action when swiped left
    console.log("Swiped left!");
  };

  const onSwipeableRightOpen = () => {
    // Your custom action when swiped right
    console.log("Swiped right!");
  };

  const renderLeftActions = (progress: any, dragX: any) => {
    // You can customize the left actions here
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {/* <Text style={{ padding: 10, backgroundColor: "blue", color: "white" }}>
          Left Action
        </Text> */}
      </View>
    );
  };

  const renderRightActions = (progress: any, dragX: any) => {
    // You can customize the right actions here
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}
      >
        <Text style={{ padding: 10, backgroundColor: "red", color: "white" }}>
          Right Action
        </Text>
      </View>
    );
  };

  if (Platform.OS === "ios") {
    return (
      <PanGestureHandler
        enabled={!isScrolling}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={(event) => onHandlerStateChange(event)}
      >
        <Animated.View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            transform: [{ translateX: translateX }],
          }}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    );
  } else {
    if (
      // page === "leave" ||
      page === "report" ||
      page === "checkAtt" ||
      page === "profile" ||
      page === "notificationAcc"
    ) {
      return (
        <PanGestureHandler
          enabled={!isScrolling}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={(event) => onHandlerStateChange(event)}
        >
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              transform: [{ translateX: translateX }],
            }}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      );
    } else {
      return (
        <Swipeable
          enabled={!isScrolling}
          onEnded={onNavigate}
          renderLeftActions={renderLeftActions}
          // renderRightActions={renderRightActions}
          // onSwipeableClose={onNavigate}
        >
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              transform: [{ translateX: translateX }],
              position: "relative",
            }}
          >
            {children}
          </Animated.View>
        </Swipeable>
      );
    }
  }
}
