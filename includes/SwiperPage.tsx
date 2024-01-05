import { Animated, Easing } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { useNavigate } from "react-router-native";

interface SwiperPageProps {
  children: React.ReactNode;
  path: string;
}

export default function SwiperPage({
  children,
  path,
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
        if (event.nativeEvent.translationX > 200) {
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

  return (
    <PanGestureHandler
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
}
