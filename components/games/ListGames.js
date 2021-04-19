import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { size } from 'lodash'
import { Image, Icon } from 'react-native-elements'
import { Rating } from 'react-native-ratings'

const { width, height } = Dimensions.get("window")


export default function ListGames({ games, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={games}
                keyExtractor={(item, index) => index.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(game) => (
                    <Game game={game} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Game({ game, navigation, handleLoadMore }) {
    const { 
        id, 
        images,
        name, 
        address, 
        description, 
        createDate, 
        createBy, 
        rating, 
        nameDev,
        developer } = game.item
    const imageGame = images[0]

    const goGame = () => {
        navigation.navigate("game", { id, name })
    } 

    return (
        <TouchableOpacity onPress={goGame}>
            <View style={styles.viewGame}>
                <View style={styles.viewGameImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageGame }}
                        style={styles.imageGame}
                    />
                </View>
                <View  style = {styles.viewGameInfo}>
                        <View>
                            <Text style = {styles.gameTitle}>
                                {name}
                            </Text>
                            <Text style = {styles.gameInformation}>
                                {developer}
                            </Text>
                            <Text style = {styles.gameInformation}>
                                {nameDev}
                            </Text>
                            <Text style = {styles.gameInformation}>
                                {address}
                            </Text>
                            <Text></Text>
                        </View>
                        <View style = {styles.calification}>
                            <Icon 
                                type = "material-community"
                                name =  { rating === 0 
                                            ?   "star-outline"
                                            :   "star"
                                        }
                                size = {30}
                                style = {styles.scoreIcon}
                                color = { rating === 0 
                                            ?   "#898989"
                                            :   "#edaf0d"
                                        }
                            />
                            <Text style = {styles.score}>  
                                {
                                    rating === 0 
                                        ? "- -"
                                        : parseFloat(rating).toFixed(1)
                                }
                            </Text>
                        </View>
                    </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewGame:{
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    viewGameInfo:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderRightWidth: 3,
        borderBottomWidth: 3,
        width: width-20,
        borderBottomRightRadius: 95,
        borderColor: "#c3c3c3",
        backgroundColor: "white",
        borderBottomLeftRadius: 10,
        marginHorizontal: 10
    },
    imageGame:{
        width: width-20,
        height: 100,
        marginHorizontal: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    viewGameImage:{

    },
    gameTitle:{
        fontWeight: "bold",
        fontSize: 16,
        left: 10,
        top: 5,
        color: "#073a9a"
    },
    gameInformation:{
        color: "gray",
        left: 10,
        top: 5
    },
    rating:{
        marginTop: 6,
        marginRight: 30
    },
    calification:{
        flexDirection: "row",
        justifyContent: "center",
        flex: 1,
        alignSelf: "center",
        padding: 5,
        alignItems: "center"
    },
    scoreIcon:{
        marginRight: 3  
    },
    score:{
        fontSize: 16
    },
    favIcon:{
        marginLeft: 10
    }
})