import React from "react";
import { FlatList, Image, View } from "react-native";
import { moderateScale } from "../ Metrics";

const ImageList = ({ imageUris }: any) => {
  return (
    <FlatList
      data={imageUris}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={{ marginRight: moderateScale(10) }}>
          <Image
            source={{ uri: item?.profileImage }}
            style={{ width: moderateScale(25), height: moderateScale(25) }}
          />
        </View>
      )}
    />
  );
};

export default ImageList;
