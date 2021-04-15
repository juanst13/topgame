import React, { useState, useEffect, useCallback } from 'react'
import {  Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'
import { useFocusEffect } from "@react-navigation/native"
import { size } from 'lodash'
import stickybits from 'stickybits'

import { getCurrentUser, getMoreStores, getStores, isUserLogged } from '../../Utils/actions'
import Loading from '../../components/Loading'
import ListStores from '../../components/Store/ListStores'
import { ScrollView } from 'react-native-gesture-handler'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const {width, height} = Dimensions.get("window")

export default function Stores({ navigation }) {
    const [user, setUser] = useState(null)
    const [startStore, setStartStore] = useState(null)
    const [stores, setStores] = useState([])    
    const [loading, setLoading] = useState(false)

    const limitStores = 7
    
    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        } )
    }, [])

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getStores(limitStores)
                if(response.statusResponse){
                    setStartStore(response.startStore)
                    setStores(response.stores)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startStore){
            return
        }

        setLoading(true)
        const response = await getMoreStores(limitStores, startStore)
        if(response.statusResponse){
            setStartStore(response.startStore)
            setStores([... stores, ...response.stores])
        }
        setLoading(false)
    }

    return (
        <ScrollView containerStyle={styles.viewBody}>
             <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
                {
                    size(stores) > 0 ?(
                        <ListStores 
                        stores = {stores} 
                        navigation = {navigation}
                        handleLoadMore = {handleLoadMore}
                        />
                    ):(
                        <View style = {styles.notFoundView}>
                            <Text style = {styles.notFoundText}>
                                No hay tiendas registradas.
                            </Text>
                        </View>
                    )
                }
                <View stickybits>
                { 
                        user && (
                                <Icon
                                    type = "material-community"
                                    name = "book-plus-multiple"
                                    containerStyle =  {styles.icon}
                                    color = "#fff"
                                    size= {35}
                                    onPress = {() => navigation.navigate("add-store")}
                                />
                        )
                }
                <Icon
                    type = "material-community"
                    name = "newspaper-variant-multiple"
                    containerStyle =  {styles.iconTop}
                    color = "#fff"
                    size= {35}
                    onPress = {() => navigation.navigate("news")}
                />
                <Icon
                    type = "material-community"
                    name = "trophy-award"
                    containerStyle =  {styles.iconBottom}
                    color = "#fff"
                    size= {35}
                    onPress = {() => navigation.navigate("news")}
                />
                </View>
                <Loading isVisible={loading} text="Cargando tiendas..."/>
            </ImageBackground>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        top: 150,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    viewBody:{
        flexDirection: "row",
        display: "flex"
    },
    notFoundView:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFoundText:{
        fontSize: 18,
        fontWeight: "bold",
        color: "white"
    },
    imageBackground:{
        width: width, 
        height: height
    },
    iconTop:{
        position: "absolute",
        top: 75,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    iconBottom:{
        position: "absolute",
        top: 200,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    }
})
