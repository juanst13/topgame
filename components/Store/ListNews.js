import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon, Image } from 'react-native-elements'
import { size } from 'lodash'
import { Rating } from 'react-native-ratings'

const {width, height} = Dimensions.get("window")

export default function ListNews({ news, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data = {news}
                keyExtractor = {(item, index) => index.toString()}
                onEndReachedThreshold = {0.5}
                onEndReached = {handleLoadMore}
                renderItem = {(notice) => (
                    <Notice notice = {notice} navigation = {navigation}/>
                )}
            />
        </View>
    )
}

function Notice({ notice, navigation, handleLoadMore }) {
    const { 
        id, 
        images, 
        name,
        description,
        category,
        rating } = notice.item
        const imagesNew = images[0]

        const goNotice = () => {
            navigation.navigate("new", { id, name })
        }

        return (
            <TouchableOpacity
                onPress = {goNotice}
            >
                <View style = {styles.viewNew}>
                    <View style = {styles.viewNewImage}>
                        <Image
                            resizeMode = "cover"
                            PlaceholderContent = {<ActivityIndicator color = "#fff"/>}
                            source = {{ uri: imagesNew}}
                            style = {styles.imageNew}
                        />
                    </View>
                    <View  style = {styles.viewNewInfo}>
                        <View>
                            <Text style = {styles.newTitle}>{name}</Text>
                            <Text style = {styles.newInformation}>
                                {
                                    description
                                }
                            </Text>
                        </View>
                        <View style ={styles.ratingC}>
                            <Text style = {styles.newInformation}>
                                {
                                    category
                                }
                            </Text>
                            <Rating
                                style={styles.rating}
                                imageSize={20}
                                readonly
                                startingValue = {parseFloat(rating)}
                                style = {styles.rating}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
} 

const styles = StyleSheet.create({
    viewNew:{
        flex: 1,
        marginTop: 5,
        marginBottom: 5
    },
    ratingC:{
        flexDirection: "row",
        justifyContent: "space-between"
    },
    viewNewInfo:{
        //borderLeftWidth: 3,
        borderRightWidth: 3,
        // borderTopWidth: 1,
        borderBottomWidth: 3,
        width: width-60,
        //borderTopRightRadius: 25,
        borderBottomRightRadius: 10,
        borderColor: "#C9C9C9",
        backgroundColor: "white",
        // borderBottomWidth: 1,
        // borderTopWidth: 1
        //borderTopLeftRadius: 25,
        borderBottomLeftRadius: 10,
        marginHorizontal: 10
    },
    imageNew:{
        width: width-60,
        height: 100,
        marginHorizontal: 10,
        borderTopLeftRadius: 10,
        //borderBottomLeftRadius: 50,
        borderTopRightRadius: 10,
        //borderBottomRightRadius: 50
        //borderRadius: 50
    },
    viewNewImage:{
        marginRight: 10
    },
    newTitle:{
        fontWeight: "bold",
        fontSize: 16,
        left: 10,
        top: 5,
        color: "#073a9a"
    },
    newInformation:{
        color: "gray",
        left: 10
    },
    rating:{
        marginRight: 10,
        marginBottom: 5
    }
})