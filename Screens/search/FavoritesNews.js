import React, { useState, useCallback, useRef } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from "@react-navigation/native"
import { Button, Icon, Image } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import { getFavorites, getFavoritesNews, removeFavoritesNews } from '../../Utils/actions'
import { btn } from '../../Styles'
import { BackgroundImage } from 'react-native-elements/dist/config'

const { width, height } = Dimensions.get("window")

export default function FavoritesNews({ navigation }) {
    const toastRef = useRef()

    const [userLogged, setUserLogged] = useState(false)
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(false)
    const [realoadData, setRealoadData] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            if (userLogged){
                async function getData() {
                    setLoading(true)
                    const response = await getFavoritesNews()
                    setNews(response.favorites)
                    setLoading(false)
                }
                getData()
            }
            setRealoadData(false)
        }, [userLogged, realoadData])
    )

    if (!userLogged){
        return <UserNoLogged navigation = {navigation}/>
    }

    if (!news) {
        return <Loading isVisible={true} text="Cargando noticias..."/>
    } else if(news?.length === 0){
        return <NotFoundStore/>
    }

    return (
        <View style = {styles.viewBody}>
            {
                news  ? (
                    <FlatList
                        data = {news}
                        keyExtractor = {(item, index) => index.toString()}
                        renderItem = {(notice) => (
                            <Notice
                                notice = {notice}
                                setLoading = {setLoading}
                                toastRef = {toastRef}
                                navigation = {navigation}
                                setRealoadData = {setRealoadData}
                            />
                        )}
                    />
                ) : (
                    <View style = {styles.loaderStore}>
                        <ActivityIndicator size = "large"/>
                        <Text style = {{textAlign: "center"}}>
                            Cargando noticias
                        </Text>
                    </View>
                )
            }
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Por favor espere..." />
        </View>
    )
}

function Notice({ notice, setLoading, toastRef, navigation, setRealoadData }) {
    const { id, name, images } = notice.item

    const ConfirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar tienda de favoritos",
            "¿Estas seguro de querer eliminar el restaurante de favoritos?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Si",
                    onPress: removeFavorite
                }
            ],
            { cancelable: false }
        )
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await removeFavoritesNews(id)
        setLoading(false)
        if(response.statusResponse){
            setRealoadData(true)
            toastRef.current.show("Noticias eliminada de favoritos", 3000)
        } else {
            toastRef.current.show("Error al eliminar noticia de favoritos.", 3000)
        }
    }

    return(
        <View style = {styles.store}>
            <TouchableOpacity
                onPress = {() => navigation.navigate("stores", {
                    screen: "notice",
                    params: {id, name}
                })}
            >
                <Image
                    style = {styles.image}
                    resizeMode = "cover"
                    PlaceholderContent = {<ActivityIndicator color = "#fff"/>}
                    source = {{ uri: images[0]}}
                />
                <View style = {styles.info}>
                    <Text style = {styles.name}>{name}</Text>
                    <Icon
                        type = "material-community"
                        name = "bookmark-plus"
                        color = "#f00"
                        size = {35}
                        containerStyle = {styles.favorite}
                        underlayColor = "transparent"
                        onPress = {ConfirmRemoveFavorite}
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

function NotFoundStore() {
    return(
        <BackgroundImage
            source = {require("../../assets/206954.jpg")}
            resizeMode = "cover"
            style = {styles.imageBack}
        >
            <View style = {{ flex:1, alignItems: "center", justifyContent: "center", alignContent: "center"}}>
                <Icon 
                    type = "material-community"
                    name = "alert-outline" 
                    size = {50}
                    color = "#fff"
                />
                <Text style = {{ fontSize: 20, fontWeight: "bold",color: "#fff" }}>
                    Aún no tienes noticias favoritas
                </Text>
            </View>
        </BackgroundImage>
    )
}

function UserNoLogged({ navigation }){
    return(
        <BackgroundImage
            source = {require("../../assets/206954.jpg")}
            resizeMode = "cover"
            style = {styles.imageBack}
        >
            <View style = {{ flex:1, alignItems: "center", justifyContent: "center", alignContent: "center"}}>
                <Icon 
                    type = "material-community" 
                    name = "alert-outline" 
                    size = {50} 
                    color = "#fff"
                />
                <Text style = {{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#fff"}}>
                    Necesitas estar logueado para ver los favoritos
                </Text>
                <Button
                    title = "Ir a login"
                    containerStyle = {{ margin: 20, width: "80%" }}
                    buttonStyle = {{ ...btn.btnIn, borderColor: "#c2c2c2", borderWidth: 1}}
                    onPress = {() => navigation.navigate("account", { screen: "login" } )}
                />
            </View>
        </BackgroundImage>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor: "#f2f2f2"
    },
    RightIconBottom:{
        position: "absolute",
        bottom: 10,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    RightIconTop:{
        position: "absolute",
        bottom: 80,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    containerBtn:{
        padding: 5
    },
    title:{
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold"
    },
    loaderStore:{
        marginVertical: 10
    },
    btns:{
        paddingVertical: 10,
        paddingBottom: 20
    },
    store:{
        margin: 10
    },
    image:{
        width: "100%",
        height: 180
    },
    info:{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: -30,
        backgroundColor: "#1c2d4e",
        borderRadius: 3,
        width: "80%",
        left: 20,
        borderRadius: 15
    },
    name:{
        fontWeight: "bold",
        fontSize: 20,
        color: "white"
    },
    favorite:{
        marginTop: -40,
        backgroundColor: "#FFFFFF",
        padding: 10,
        borderRadius: 10,
        borderColor: "#1c2d4e",
        borderWidth: 1
    },
    iconBottom:{
        position: "absolute",
        bottom: 10,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    imageBack:{
        width: width, 
        height: height
    }
})
