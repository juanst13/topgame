import React, { useState, useEffect, useCallback } from 'react'
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from "@react-navigation/native"

import { getMoreNews, getNews } from '../../Utils/actions'
import { size } from 'lodash'
import ListNews from '../../components/Store/ListNews'

const {width, height} = Dimensions.get("window")

export default function News({ navigation }) {
    const [userLogged, setUserLogged] = useState(false)
    const [startNew, setStartNew] = useState(null)
    const [news, setNews] = useState([])    
    const [loading, setLoading] = useState(false)

    const limitNews = 7

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getNews(limitNews)
                if(response.statusResponse){
                    setStartNew(response.startNew)
                    setNews(response.news)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )

    const handleLoadMore = async() => {
        if (!startNew){
            return
        }

        setLoading(true)
        const response = await getMoreNews(limitNews, startNew)
        if(response.statusResponse){
            setStartNew(response.startNew)
            setNews([... news, ...response.news])
        }
        setLoading(false)
    }

    return (
        <ScrollView style={styles.viewBody}>
            <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
                {
                    size(news) > 0 ?(
                        <ListNews
                            news = {news} 
                            navigation = {navigation}
                            handleLoadMore = {handleLoadMore}
                        />
                    ):(
                        <View style = {styles.notFoundView}>
                            <Text style = {styles.notFoundText}>
                                No hay noticias registradas.
                            </Text>
                        </View>
                    )
                }
                { 
                        userLogged && (
                            <Icon
                                type = "material-community"
                                name = "newspaper-plus"
                                containerStyle =  {styles.icon}
                                color = "#fff"
                                size= {35}
                                onPress = {() => navigation.navigate("add-new")}
                            />
                    )
                }
                <Icon
                    type = "material-community"
                    name = "book-multiple"
                    containerStyle =  {styles.iconTop}
                    color = "#fff"
                    size= {35}
                    onPress = {() => navigation.navigate("stores")}
                />
                <Icon
                    type = "material-community"
                    name = "trophy-award"
                    containerStyle =  {styles.iconBottom}
                    color = "#fff"
                    size= {35}
                    onPress = {() => navigation.navigate("news")}
                />
            </ImageBackground>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        height: "100%"
    },
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
    }
})
