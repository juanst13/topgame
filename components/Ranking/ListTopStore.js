import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Card, Icon, Image} from 'react-native-elements'
import { Rating } from 'react-native-ratings'

export default function ListTopStore({ stores, navigation }) {
    
    return (
        <FlatList
            data={stores}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(store) => (
                <Store store={store} navigation={navigation}/>
            )}
        />
    )
}

function Store({ store, navigation }) {
    const { name, rating, images, description, id } = store.item
    const [iconColor, setIconColor] = useState("#000")

    useEffect(() => {
        if(store.index === 0){
            setIconColor("#efb819")
        } else if (store.index === 1){
            setIconColor("#e3e4e5")
        } else if(store.index === 2){
            setIconColor("#cd7f32")
        }
    }, [])

    return (
        <View>
            <TouchableOpacity
                    onPress={() => navigation.navigate("stores", {
                        screen: "store",
                        params: { id, name }
                    })}
            >
                <Card containerStyle = {styles.containerCard}>
                    <Icon
                        type = "material-community"
                        name = "chess-queen"
                        color = {iconColor}
                        size = {40}
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
        top: -30,
        left: -30,
        zIndex: 1 //Por encima de la imagen
    },
    storeImage:{
        width: "100%",
        height: 200
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
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
