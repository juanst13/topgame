import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Card, Icon, Image} from 'react-native-elements'
import { Rating } from 'react-native-ratings'

export default function ListTopGame({ games, navigation }) {
    
    return (
        <FlatList
            data={games}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(game) => (
                <Game game={game} navigation={navigation}/>
            )}
        />
    )
}

function Game({ game, navigation }) {
    const { name, rating, images, description, id } = game.item
    const [iconColor, setIconColor] = useState("#000")

    useEffect(() => {
        if(game.index === 0){
            setIconColor("#efb819")
        } else if (game.index === 1){
            setIconColor("#C0C0C0")
        } else if(game.index === 2){
            setIconColor("#cd7f32")
        }
    }, [])

    return (
        <View>
            <TouchableOpacity
                    onPress={() => navigation.navigate("games", {
                        screen: "game",
                        params: { id, name }
                    })}
            >
                <Card containerStyle = {styles.containerCard}>
                    <Icon
                        type = "material-community"
                        name = "crown"
                        color = {iconColor}
                        size = {60}
                        containerStyle = {styles.containerIcon}
                    />
                    <Image
                        style = {styles.storeImage}
                        resizeMode = "cover"
                        PlaceholderContent = {<ActivityIndicator size = "large" color = "#fff"/>}
                        source = {{ uri: images[0]}}
                    />
                    <View style = {styles.titleRating}>
                        <Text style = {styles.title}>{name}</Text>
                        <Rating
                            imageSize = {20}
                            startingValue = {rating}
                            readonly
                        />
                    </View>
                    <Text styles = {styles.description}>{description}</Text>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle:{
        marginBottom: 30,
        borderWidth: 0
    },
    containerIcon: {
        position: "absolute",
        top: 15,
        left: -15,
        zIndex: 1, //Por encima de la imagen
        backgroundColor: "#FFF",
        borderRadius: 30,
        paddingVertical: 5,
        paddingHorizontal: 5
    },
    storeImage:{
        width: "100%",
        height: 200
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#073a9a"
    },
    description: {
        color: "gray",
        marginTop: 0,
        textAlign: "justify"
    },
    titleRating:{
        flexDirection: "row",
        flex: 1,
        marginVertical: 10,
        justifyContent: "space-between"
    }
})
