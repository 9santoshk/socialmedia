import React, { useState } from 'react';
import { View, TextInput, Image, Button, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';

import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
require('firebase/compat/storage')


export default function Save( props ) {
    console.log(" inside save function", props)
    console.log(props.route.params.image);
    const [caption, setCaption] = useState("")
    const [imageUpload, setImageUpload] = useState(null);

    const UploadImage = async () => {

        const uri = props.route.params.image;
        const childPath=`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath);
        
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase.storage().ref(childPath).put(blob);
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) =>{
              savePostData(snapshot);
              console.log(snapshot);
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }
        
          task.on("state_changed", taskProgress, taskError, taskCompleted);

    }
    const savePostData = (downloadURL) => {
      firebase.firestore()
        .collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
          downloadURL,
          caption,
          likesCount: 0,
          creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((function () {
          props.navigation.popToTop()
        }) )
    }


  return (
    <View style={{flex:1}}>
        <Image source={{uri: props.route.params.image}}/> 
        <TextInput
            placeholder="write a caption"
            onChangeText={(caption) => setCaption(caption)}
        />
        <Button title="Save" onPress={()=> UploadImage()}/>
      
    </View>
  )
}
