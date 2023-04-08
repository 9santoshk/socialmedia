import React, {useState, useEffect} from 'react';
import { StyleSheet, View,Text, Image, FlatList, Button} from 'react-native';
import { connect } from 'react-redux';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
require('firebase/compat/firestore')
import { getAuth, signOut } from "firebase/compat/auth"


function Profile ( props ) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState();
    const [following, setFollowing] = useState(false)

    // console.log(props)
    useEffect(()=>{
        const { currentUser, posts } = props;
        console.log({currentUser, posts});

        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser);
            setUserPosts(posts);
        } 
        else{
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot)=>{
                    if (snapshot.exists){
                        setUser(snapshot.data())
                    }
                    else{
                        console.log('does not exist');
                    }
                })
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot)=>{
                    console.log(snapshot.docs);
                    let posts = snapshot.docs.map(doc => {
                        const data  = doc.data();
                        const id = doc.id;
                        return {id, ...data};
                    })
                    setUserPosts(posts)
                })
           
        }
        if(props.following && props.following.indexOf(props.route.params.uid) > -1 ){
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following ])

    // console.log("profile function enter", props);
    const onFollow = () => {
        console.log('entering onfollow');
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
            .then(() => setFollowing(true))

    }

    const onUnfollow = () => {
        console.log('entering unfollow')
        firebase.firestore()
           .collection("following")
           .doc(firebase.auth().currentUser.uid)
           .collection("userFollowing")
           .doc(props.route.params.uid)
           .delete()
           .then(() => setFollowing(false))
        }


    const onLogout = () => {
        firebase.auth().signOut();
    }

   if(user === null || user === undefined){
        return (<View> 
                    <Text>  No user found </Text>
                </View>
                )
    }
    console.log(user)
    return(
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text> User name:  {user.name}  </Text>
                <Text> Email: {user.email} </Text>

                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following? (
                            <Button
                                title= "Following"
                                onPress={() => onUnfollow()}
                            />
                        ): (
                            <Button
                                title= "Follow"
                                onPress={() => onFollow()}  
                            />
                        )}
                    </View>
                ): (
                    <Button
                        title = "logout"
                        onPress={() => onLogout()}
                    />
                )}

            </View>       
            <View style={styles.containerGallery}>
                <FlatList 
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({item}) => (
                        <View  style={styles.containerImage}>
                            <Image 
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View>
                    )}  
                />
            </View>       
        </View>       
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        // marginTop: 40
    },
    containerInfo: {
        margin: 20
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    }
})

const mapStateToProps = ( store ) => ({
    currentUser : store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null) (Profile);