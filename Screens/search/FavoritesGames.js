import React, { useState, useCallback, useRef } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from "@react-navigation/native"
import { Button, Icon, Image } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import { getFavorites, getFavoritesGames, removeFavoriteGame, removeFavorites } from '../../Utils/actions'
import { btn } from '../../Styles'

const {width, height} = Dimensions.get("window")

export default function FavoritesGames({ navigation }) {
    const toastRef = useRef()

    const [userLogged, setUserLogged] = useState(false)
    const [games, setGames] = useState([])
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
                    const response = await getFavoritesGames()
                    setGames(response.favorites)
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

    if (!games) {
        return <Loading isVisible={true} text="Cargando juegos..."/>
    } else if(games?.length === 0){
        return <NotFoundStore/>
    }

    return (
        <View style = {styles.viewBody}>
            {
                games  ? (
                    <FlatList
                        data = {games}
                        keyExtractor = {(item, index) => index.toString()}
                        renderItem = {(game) => (
                            <Store
                                game = {game}
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
                            Cargando juegos
                        </Text>
                    </View>
                )
            }
            <View style = {styles.btns}>
                <Icon
                    containerStyle = {styles.RightIconTop}
                    type = "material-community"
                    name = "tank"
                    onPress = {() => navigation.navigate("list-favorites-games")}
                    color = "#073a9a"
                    size= {20}
                    reverse
                />
                <Icon
                    containerStyle = {styles.RightIconBottom}
                    type = "material-community"
                    name = "controller-classic"
                    onPress = {() => navigation.navigate("list-favorites-consoles")}
                    color = "#84a4e0"
                    size= {20}
                    reverse
                />
                <Icon
                    containerStyle = {styles.iconBottom}
                    type = "material-community"
                    name = "newspaper-variant-multiple"
                    onPress = {() => navigation.navigate("list-favorites-news")}
                    color = "#d9b453"
                    size= {20}
                    reverse
                />
            </View>
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Por favor espere..." />
        </View>
    )
}

function Store({ game, setLoading, toastRef, navigation, setRealoadData }) {
    const { id, name, images } = game.item

    const ConfirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar juego de favoritos",
            "¿Estas seguro de querer eliminar el juego de favoritos?",
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
        const response = await removeFavoriteGame(id)
        setLoading(false)
        if(response.statusResponse){
            setRealoadData(true)
            toastRef.current.show("Tienda eliminada de favoritos", 3000)
        } else {
            toastRef.current.show("Error al eliminar tienda de favoritos.", 3000)
        }
    }

    return(
        <View style = {styles.store}>
            <TouchableOpacity
                onPress = {() => navigation.navigate("games", {
                    screen: "game",
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
                        size = {30}
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
            <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
                <View style = {{ flex:1, alignItems: "center", justifyContent: "center"}}>
                    <Icon type = "material-community" name = "alert-outline" size = {50} color= "#fff"/>
                    <Text style = {{ fontSize: 20, fontWeight: "bold", color: "#FFFFFF" }}>
                        Aún no tienes juegos favoritos
                    </Text>
                </View>
            </ImageBackground>
    )
}

function UserNoLogged({ navigation }){
    return(
        <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
        >
        <View style = {{ flex: 1, alignItems: "center", justifyContent: "center", alignContent: "center" }}>
            
            <Icon type = "material-community" name = "alert-outline" size = {50} color= "#fff"/>
            <Text style = {{ fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center", marginHorizontal: 20}}>
                Necesitas estar logueado para ver los favoritos
            </Text>
            <Button
                title = "Ir al login"
                containerStyle = {{ margin: 20, width: "80%" }}
                buttonStyle = {{ ...btn.btnIn }}
                onPress = {() => navigation.navigate("account", { screen: "login" } )}
            />
        </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor: "#f2f2f2"
    },
    RightIconBottom:{
        position: "absolute",
        bottom: 80,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    RightIconTop:{
        position: "absolute",
        bottom: 150,
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
        paddingVertical: 10,
        marginTop: -30,
        backgroundColor: "#04235c",
        width: "80%",
        left: 20,
        borderRadius: 10
    },
    name:{
        fontWeight: "bold",
        fontSize: 20,
        color: "white"
    },
    favorite:{
        marginTop: -45,
        backgroundColor: "#FFFFFF",
        padding: 5,
        borderRadius: 10
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
    imageBackground:{
        width: width,
        height: height
    }
})
