import React, { useState, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Avatar, Button } from 'react-native-elements'
import moment from 'moment/min/moment-with-locales'
import { map, size } from 'lodash'
import { Rating } from 'react-native-ratings'
import { useFocusEffect } from '@react-navigation/native'
import { getGameReviews } from '../../Utils/actions'


moment.locale("es")

export default function ListReviews({ navigation, idGame }) {
    const [userLogged, setUserLogged] = useState(false)
    const [reviews, setReviews] = useState([])

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getGameReviews(idGame)
                if (response.statusResponse) {
                    setReviews(response.reviews)
                }
            })()
        }, [])
    )

    return (
        <View>
            {
                userLogged ? (
                    <Button
                        buttonStyle={styles.btnAddReview}
                        title="Cuentanos tu opinión"
                        titleStyle={styles.btnTitleAddReview}
                        onPress={() => navigation.navigate("add-review-game", { idGame })}
                        icon={{
                            type: "material-community",
                            name: "square-edit-outline",
                            color: "#073a9a"
                        }}
                    />
                ) : (
                    <Text 
                        style={styles.mustLoginText}
                        onPress={() => navigation.navigate("login")}
                    >
                        Para escribir una opinión es necesario estar logueado.{" "}
                        <Text style={styles.loginText}>
                            Pusla AQUÍ para iniciar sesión.
                        </Text>
                    </Text>
                )
            }
            {
                size(reviews) > 0 && (
                    map(reviews, reviewDocument => (
                        <Review reviewDocument={reviewDocument}/>
                    ))
                )
            }
        </View>
    )
}

function Review({ reviewDocument }) {
    const { title, review, createAt, avatarUser, rating } = reviewDocument 
    const createReview = new Date(createAt.seconds * 1000)

    return (
        <View style={styles.viewReview}>
            <View style={styles.imageAvatar}>
                <Avatar
                    renderPlaceholderContent={<ActivityIndicator color="#fff"/>}
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={
                        avatarUser
                            ? { uri: avatarUser}
                            : require("../../assets/avatar-default.jpg")
                    }
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>{moment(createReview).format("LLL")}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview:{
        backgroundColor: "transparent",
        marginVertical: 15,
        borderWidth: 2,
        borderRadius: 10,
        width: "95%",
        alignSelf: "center",
        borderColor: "#84a4e0"    
    },
    btnTitleAddReview:{
        color: "#073a9a"
    },
    mustLoginText:{
        textAlign: "center",
        color: "#091d41",
        padding: 20
    },
    loginText:{
        fontWeight: "bold"
    },
    viewReview:{
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        width: "95%",
        height: 100,
        alignSelf: "center",
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        color: "#f2f2f2",
        margin: 5,
        backgroundColor: "#d2e0f7"
    },
    imageAvatar:{
        marginRight: 15
    },
    imageAvataruser:{
        width: 50,
        height: 50
    },
    viewInfo:{
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle:{
        fontWeight: "bold"
    },
    reviewText: {
        paddingTop: 2,
        color: "gray",
        marginBottom: 5
    },
    reviewDate:{
        marginTop: 5,
        color: "gray",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
})
