import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Image, ListItem, SearchBar } from 'react-native-elements'
import { isEmpty, size } from 'lodash'
import { searchStore } from '../../Utils/actions'

export default function Search({ navigation }) {
    const [search, setSearch] = useState("")
    const [stores, setStores] = useState([])

    useEffect(() => {
        if (isEmpty(search)){
            return
        }

        async function getData() {
            const response = await searchStore(search)
            if (response.statusResponse) {
                setStores(response.stores)
            }
        }
        getData()
    }, [search])

    return (
        <View style = {styles.container}>
            <SearchBar
                placeholder = "Ingresa el nombre de tienda..."
                onChangeText = {(e) => setSearch(e)}
                containerStyle = {styles.searchBar}
                value = {search}
            />
            {
                size(stores) > 0 ? (
                    <FlatList
                        data={stores}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(store) => 
                            <Store
                                store={store}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.notFound}>
                            Ingrese las primeras letras del nombre del restaurante.
                        </Text>
                    ) : (
                        <Text style={styles.notFound}>
                            No hay restaurantes que coincidan con el critertio de búsqueda.
                        </Text>
                    )
                )
            }
            
            <Button
                title = "Top 10"
                buttonStyle = {styles.btn}
                titleStyle = {styles.btnTitle}
                icon = {
                    <Icon
                        type = "material-community"
                        name = "trophy"
                        containerStyle =  {styles.iconBottom}
                        color = "#FFF"
                        size= {25}
                    />
                }
                onPress = {() => navigation.navigate("top-stores")}
            />
        </View>
    )
}

function Store({ store, navigation }) {
    const { id, images, name } = store.item

    return (
        <ListItem
            style = {styles.menuItem}
            onPress = {() => navigation.navigate("stores", {
                screen: "store",
                params: {id, name}
            })}
        >
            <Image
                resizeMode = "cover"
                PlaceholderContent = {<ActivityIndicator color = "#fff" />}
                source = {{uri: images[0]}}
                style = {styles.imageStore}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <Icon
                type = "material-community"
                name = "chevron-right"
            />
        </ListItem>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        justifyContent: "flex-end"
    },
    icon:{
        position: "absolute",
        top: 150,
        right: 15,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    btnTitle:{ 
        marginHorizontal: 10,
        fontSize: 20
    },
    btn:{
        backgroundColor: "#d9b453",
        width: "90%",
        alignSelf: "center",
        marginVertical: 20
    },
    searchBar:{
        marginBottom: 20,
        backgroundColor: "#fff"
    },
    imageStore: {
        width: 90,
        height: 90
    },
    notFound:{
        alignSelf: "center",
        width: "90%"
    },
    menuItem:{
        margin: 10
    },
    container:{
        flex: 1
    }
})
