import { View, Text } from "react-native";
import NotificaitonMeetingStyle from "../styles/NotificationMeetingStyle.scss";
import SwiperPage from "../includes/SwiperPage";
import { moderateScale } from "../ Metrics";

export default function NotificationMeetingScreen() {
  return (
    <SwiperPage path="/home" page="notificationMeet" isScrolling={false}>
      <View style={NotificaitonMeetingStyle.NotificationMeetingContainer}>
        <Text
          style={[
            NotificaitonMeetingStyle.NotificationMeetingTitle,
            { fontSize: moderateScale(14) },
          ]}
        >
          This feature is not availble!
        </Text>
      </View>
    </SwiperPage>
  );
}
