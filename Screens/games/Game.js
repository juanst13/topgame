import React, { useState, useCallback, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import { ListItem, Icon, Input, Button } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'
import * as Font from 'expo-font'
import {Rating} from 'react-native-ratings'

import CarouselImages from '../../components/CarouselImage'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'
import MapGame from '../../components/games/MapGame'
import { addDocumentWithOutId, getCurrentUser, getDocumentById, getIsFavoriteGame, deleteFavoriteGame, removeFavoriteGame } from '../../Utils/actions'
import ListReviews from '../../components/games/ListReviews'

const widthScreen = Dimensions.get("window").width

export default function Game({ navigation, route}) {

    const { id, name } = route.params
    const toastRef = useRef()

    const [fontsLoaded, setFontsLoaded] = useState(false)

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
    
    const [game, setGame] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modalNotification, setModalNotification] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })


    React.useLayoutEffect(() => {
        navigation.setOptions({
          title: name === '' ? 'No title' : name,
        });
      }, [navigation, name])
      

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("games", id)
                if (response.statusResponse) {
                    setGame(response.document)
                } else {
                    setGame({})
                    Alert.alert("Ocurri?? un problema cargando el juego, intente m??s tarde.")
                }
            })()
        }, [id])
    )

    useEffect(() => {
        (async() => {
            if (userLogged && game) {
                const response = await getIsFavoriteGame(game.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, game])

    const addFavorite = async() => {
        if (!userLogged) {
            toastRef.current.show("Para agregar el juego a favoritos debes estar logueado.", 3000)
            return
        }

        setLoading(true)
        const response = await addDocumentWithOutId("favoritesGames", {
            idUser: getCurrentUser().uid,
            idGame: game.id
        })
        setLoading(false)
        if (response.statusResponse) {
            setIsFavorite(true)
            toastRef.current.show("El juego se a??adido a favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo adicionar el juego a favoritos. Por favor intenta m??s tarde.", 3000)
        }
    }

    const removeFavoritesGame = async() => {
        setLoading(true)
        const response = await removeFavoriteGame(game.id)
        setLoading(false)

        if (response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show("Se ha eliminado el juego de favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo eliminar el juego de favoritos. Por favor intenta m??s tarde.", 3000)
        }
    }


    if (!game) {
        return <Loading isVisible={true} text="Cargando..."/>
    }
    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={game.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorite}>
            <Icon
                    type = "material-community"
                    name = { isFavorite ? "bookmark-plus" : "bookmark-plus-outline"}
                    onPress = { isFavorite ? removeFavoritesGame : addFavorite}
                    color = { isFavorite ? "#073a9a" : "#9c9c9c"}
                    size = {30}
                    underlayColor = "transparent"
                />
            </View>
            <TitleGame
                name={game.name}
                description={game.description}
                rating={game.rating}
            />
            <GameInfo
                name={game.name}
                location={game.location}
                address={game.address}
                createDate={game.createDate}
                createBy={game.createBy}
                developer = {game.developer}
                currentUser={currentUser}
                setLoading={setLoading}
                setModalNotification={setModalNotification}
                nameDev = {game.nameDev}
            />
            <ListReviews
                navigation={navigation}
                idGame={game.id}
            />
            <SendMessage
                modalNotification={modalNotification}
                setModalNotification={setModalNotification}
                setLoading={setLoading}
                game={game}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor espere..."/>
        </ScrollView>
    )
}

function SendMessage ({ modalNotification, setModalNotification, setLoading, game }) {
    const [title, setTitle] = useState(null)
    const [errorTitle, setErrorTitle] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendNotification = async() => {
        if (!validForm()) {
            return
        }

        setLoading(true)
        const userName = getCurrentUser().displayName ? getCurrentUser().displayName : "An??nimo"
        const theMessage = `${message}, del juego: ${game.name}`

        const usersFavorite = await getUsersFavorite(game.id)
        if (!usersFavorite.statusResponse) {
            setLoading(false)
            Alert.alert("Error al obtener los usuarios que aman el juego.")
            return
        }

        await Promise.all (
            map(usersFavorite.users, async(user) => {
                const messageNotification = setNotificationMessage(
                    user.token,
                    `${userName}, dijo: ${title}`,
                    theMessage,
                    { data: theMessage}
                )
        
                await sendPushNotification(messageNotification)
            })
        )

        setLoading(false)
        setTitle(null)
        setMessage(null)
        setModalNotification(false)
    }

    const validForm = () => {
        let isValid = true;

        if (isEmpty(title)) {
            setErrorTitle("Debes ingresar un t??tulo a tu mensaje.")
            isValid = false
        }

        if (isEmpty(message)) {
            setErrorMessage("Debes ingresar un mensaje.")
            isValid = false
        }

        return isValid
    }

    return (
        <Modal
            isVisible={modalNotification}
            setVisible={setModalNotification}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.textModal}>
                    Env??ale un mensaje a los amantes de {game.name}
                </Text>
                <Input
                    placeholder="T??tulo del mensaje..."
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Mensaje..."
                    multiline
                    inputStyle={styles.textArea}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    errorMessage={errorMessage}
                />
                <Button
                    title="Enviar Mensaje"
                    buttonStyle={styles.btnSend}
                    containerStyle={styles.btnSendContainer}
                    onPress={sendNotification}
                />
            </View>
        </Modal>
    )
}

function GameInfo({ 
    name, 
    location, 
    address, 
    createDate, 
    createBy, 
    developer,
    currentUser,     
    setLoading,
    setModalNotification,
    nameDev
}) {
    const listInfo = [
        { type: "address", text: address, iconLeft: "map-marker" },
        { type: "createBy", text: developer , iconLeft: "hammer-screwdriver" },
        { type: "createDate", text: nameDev, iconLeft: "keyboard" },
    ]

    return (
        <View style={styles.viewGameInfo}>
            <Text style={styles.gameInfoTitle}>
                Informaci??n sobre el Juego
            </Text>
            <MapGame
                location={location}
                name={name}
                height={150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconLeft}
                            color="#073a9a"
                            onPress={() => actionLeft(item.type)}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (
                                <Icon
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#073a9a"
                                    onPress={() => actionRight(item.type)}
                                />
                            )
                        }
                    </ListItem>
                ))
            }
        </View>
    )
}

function TitleGame({ name, description, rating }) {
    return (
        <View style={styles.viewGameTitle}>
            <View style={styles.viewGameContainer}>
                <Text style={styles.nameGame}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionGame}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewGameTitle: {
        padding: 15,
    },
    viewGameContainer: {
        flexDirection: "row"
    },
    descriptionGame: {
        marginTop: 10,
        color: "gray",
        textAlign: "justify",
        fontFamily: "Lobster-Regular",
        fontSize: 18,
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameGame: {
        fontWeight: "bold"
    },
    viewGameInfo: {
        margin: 15,
        marginTop: 25
    },
    gameInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#073a9a",
        borderBottomWidth: 1
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#073a9a"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold"
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    viewFavorite:{
        position: "absolute",
        top: 0,
        right: 40,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingBottom: 5
    }
})
