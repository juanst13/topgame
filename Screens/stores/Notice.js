import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, ScrollView, View, ActivityIndicator } from 'react-native'
import { Rating } from 'react-native-ratings'
import { Avatar, Button, Icon, Image, ListItem } from 'react-native-elements'
import { map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'
import * as Font from 'expo-font'
import moment from 'moment/min/moment-with-locales'

import { addDocumentWithOutId, getCurrentUser, getDocumentById, getIsFavoriteNotice, removeFavoritesNews } from '../../Utils/actions'
import CarouselImage from '../../components/CarouselImage'
import Loading from '../../components/Loading'
import ListReviewsNews from '../../components/Store/ListReviewsNews'

const {width, heigth} = Dimensions.get("window")
moment.locale("es")

export default function Notice({ navigation, route}) {
    const { id, name } = route.params
    const toastRef = useRef()

    useEffect(() => {
        if(!fontsLoaded){
           loadFonts() 
        }
    })

    const loadFonts = async() => {
        await Font.loadAsync({
            'Suranna-Regular': 
            require
            ("../../assets/fonts/Suranna-Regular.ttf"),
            'Lobster-Regular': 
            require
            ("../../assets/fonts/Lobster-Regular.ttf"),
            'Antonio-Regular': 
            require
            ("../../assets/fonts/Antonio-Regular.ttf"),
            'Inconsolata-Regular': 
            require
            ("../../assets/fonts/Inconsolata-Regular.ttf"),
            'OrelegaOne-Regular': 
            require
            ("../../assets/fonts/OrelegaOne-Regular.ttf"),
            'PlayfairDisplay-Regular': 
            require
            ("../../assets/fonts/PlayfairDisplay-Regular.ttf")
        })
        setFontsLoaded(true)
    }

    const [notice, setNotice] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fontsLoaded, setFontsLoaded] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    React.useLayoutEffect(() => {
        navigation.setOptions({
          title: name === '' ? 'No title' : name,
        });
      }, [navigation, name])

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("news", id)
                if (response.statusResponse){
                    setNotice(response.document)
                } else {
                    setNotice({})
                    Alert.alert("Ocurrió un problema cargando la noticia, intente más tarde.")
                }
            })()

        }, [])
    )

    useEffect(() => {
        (async() => {
            if (userLogged && notice){
                const response = await getIsFavoriteNotice(notice.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, notice])

    const addFavorite = async() => {
        if (!userLogged){
            toastRef.current.show
                ("Para agregar la noticia a favoritos debes estar logueado.",3000)
            return
        }
        setLoading(true)
        const response = await addDocumentWithOutId("favoritesNews", {
            idUser: getCurrentUser().uid,
            idNotice: notice.id
        })
        setLoading(false)

        if(response.statusResponse) {
            setIsFavorite(true)
            toastRef.current.show("Noticia añadida a favoritos.", 3000)
        } else {
            toastRef.current.show
            ("No se pudo adicionar la noticia a favoritos, por favor intenta más tarde.", 
            3000)
        }

    } 

    const removeFavorite = async() => {
        setLoading(true)
        const response = await removeFavoritesNews(notice.id)
        setLoading(false)
        if (response.statusResponse){
            toastRef.current.show("Noticia eliminada de favoritos", 3000)
            setIsFavorite(false)
        } else {
            toastRef.current.show
                ("No se pudo eliminar la noticia de favoritos, por favor intenta más tarde",
                3000)
        }
    }

    if (!notice){
        return <Loading isVisible = {true} text = "Cargando..."/>
    }

    return (
        <ScrollView style = {styles.viewBody}>
            <CarouselImage
                images = {notice.images}
                height = {200}
                width = {width}
                activeSlide = {activeSlide}
                setActiveSlide = {setActiveSlide}
            />
            <View style = {styles.viewFavorite}>
            <Icon
                type = "material-community"
                name = { isFavorite ? "bookmark-plus" : "bookmark-plus-outline"}
                onPress = { isFavorite ? removeFavorite : addFavorite}
                color = { isFavorite ? "#073a9a" : "#9c9c9c"}//"#d9b453"
                size = {30}
                underlayColor = "transparent"
            />
            </View>
            <InfoNew
                name = {notice.name}
                description = {notice.description}
                category = {notice.category}
                createAt = {notice.createAt}
                createBy = {notice.createByName}
                rating = {notice.rating}
                avatar = {notice.avatar}
            />
            <ListReviewsNews
                navigation = {navigation}
                idNotice = {notice.id}
            />
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Por favor espere..."/>
        </ScrollView>
    )
}

function InfoNew({ name, description, category, createAt, createBy, rating, avatar }) {
    const createNotice = new Date(createAt.seconds * 1000)

    return(
        <View>
            <View style = {styles.infoTitle}>
                <Text style = {styles.title}>{name}</Text>
                <Rating
                    style = {styles.rating}
                    imageSize = {20}
                    readonly
                    startingValue = {parseFloat(rating)}
                />
            </View>
            <View style = {styles.containerInfo}>
                <Button 
                    buttonStyle = {styles.category}
                    title = {category}
                    titleStyle = {{ color: "#626262" }}
                />
                <Text style = {styles.createAt}>
                    Publicado {moment(createNotice).format("LLL")}
                </Text>
            </View>
            <View> 
                <Text style = {styles.body}>{description}</Text>
            </View>
            <View style = {styles.avatar}>
                <Avatar
                    source ={ avatar 
                                ? { uri: avatar }
                                : require("../../assets/avatar-default.jpg")
                            }
                    rounded
                    renderPlaceholderContent={<ActivityIndicator color="#fff"/>}
                    size="large"
                />
                {createBy 
                    ? <Text style = {styles.createBy}>{createBy}</Text>
                    : <Text style = {styles.createBy}>Anónimo</Text>
                } 
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    viewBody:{
        backgroundColor: "#fff"
    },
    infoTitle:{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        marginBottom: 10
    },
    title:{
        fontWeight: "bold",
        fontSize: 18
    },
    category:{
        backgroundColor: "#e7e7e7",
        width: "20%",
        padding: 2,
        marginBottom: 5
    },
    createAt:{
        marginBottom: 5
    },
    containerInfo:{
        flex: 1,
        marginHorizontal: 15,
        marginBottom: 5
    },
    body:{
        marginHorizontal: 15,
        marginBottom: 15,
        color: "gray",
        textAlign: "justify",
        fontFamily: "Lobster-Regular",
        fontSize: 18,
        textAlign: "justify"
    },
    avatar:{
        marginTop: 15,
        flexDirection: "row",
        marginHorizontal: 30,
        alignItems: "center",
        padding: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: "#f9f9f9"
    },
    createBy:{
       marginLeft: 15,
       fontSize: 16
    },
    viewFavorite:{
        position: "absolute",
        top: 0,
        right: 40,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        //borderRadius: 30,
        //padding: 2,
        paddingBottom: 5
    }
})
