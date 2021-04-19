import React, { useState, useEffect, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'
import { size } from 'lodash'


import ListGames from '../../components/games/ListGames'
import Loading from '../../components/Loading'
import { getGames, getMoreGames } from '../../Utils/actions'



export default function Games({ navigation }) {
    const [user, setUser] = useState(null)
    const [startGame, setStartGame] = useState(null)
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(false)

    const limitGames = 7

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        })   
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getGames(limitGames)
                if (response.statusResponse) {
                    setStartGame(response.startGame)
                    setGames(response.games)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startGame) {
            return
        }

        setLoading(true)
        const response = await getMoreGames(limitGames, startGame)
        if (response.statusResponse) {
            setStartGame(response.startRestaurant)
            setGames([...games, ...response.games])
        }
        setLoading(false)
    }

    if (user === null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.viewBody}>
             {
                size(games) > 0 ? (
                    <ListGames
                        games={games}
                        navigation={navigation}
                        handleLoadMore={handleLoadMore}
                    />
                ) : (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay juegos registrados.</Text>
                    </View>
                )
            }
        {
            user && (
                <Icon
                    type = "material-community"
                    name = "book-plus-multiple"
                    containerStyle =  {styles.icon}
                    color = "#d9b453"
                    size= {25}
                    reverse
                    onPress={() => navigation.navigate("add-games")}
                />
            )                
        }   
        <Loading isVisible={loading} text="Cargando juegos..."/>         
    </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        backgroundColor: "#cfcfcf",
        flex: 1,
    },
    btnContainer: {
        position: "absolute",    
        top: "50%",
        right: 20,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center"
    },
    icon: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.9,
        borderRadius: 50,
        padding: 5
    }
})
