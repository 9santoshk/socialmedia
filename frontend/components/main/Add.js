import { Camera, CameraType, ImageType } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// import Save from './Save';

// import { useWindowDimensions } from "react-native";

export default function Add({ navigation }) {
  // console.log(" inside add screen", this.props)
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  
//   const width = useWindowDimensions();
//   const height = Math.round((width * 16) / 9);


//   const CameraComponent = () => {
//     const {width} = useWindowDimensions();
//     const height = Math.round((width * 16) / 9);
//     return (height/width);
//   };


  
  const takePicture  = async () => {
    if (camera){
        const data = await camera.takePictureAsync(null);
        // console.log(data.uri);
        setImage(data.uri);
    }
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const camerRatiosAllowed = async () => {
    if(camera){
        allowedRatio = await camera.getSupportedRatiosAsync(); 
        console.log(allowedRatio);
        // return (allowedRatio);
    }
}

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
        <View style={styles.cameraContainer}>
            <Camera 
            ref={ref => setCamera(ref)}
            style={styles.fixedRatio} 
            type={type} 
            ratio={'4:3'}/> 
        </View>
        <Button title='Flip Image' onPress={toggleCameraType}></Button>
        {/* <Button title='ratio' onPress={()=> camerRatiosAllowed()}/>   */}
        <Button title='Take picture' onPress={()=> takePicture()}/>
        <Button title='Pick image from gallery' onPress={()=> pickImage()}/>
        <Button title='Save picture' onPress={()=> navigation.navigate('Save',{image})}/>
        {image && <Image source={{uri: image}} style={{flex:1}} />}
    </View>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    // alignSelf: 'flex-end',
    alignItems: 'center',
  },
  fixedRatio:{
    flex:1,
    aspectRatio: 1.22
},
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
