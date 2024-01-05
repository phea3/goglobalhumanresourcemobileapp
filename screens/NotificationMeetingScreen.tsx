import { View, Text } from "react-native";
import NotificaitonMeetingStyle from "../styles/NotificationMeetingStyle.scss";
import SwiperPage from "../includes/SwiperPage";

export default function NotificationMeetingScreen() {
  return (
    <SwiperPage path="/home" page="notificationMeet" isScrolling={false}>
      <View style={NotificaitonMeetingStyle.NotificationMeetingContainer}>
        <Text style={NotificaitonMeetingStyle.NotificationMeetingTitle}>
          This feature is not availble!
        </Text>
      </View>
    </SwiperPage>
  );
}
