import React, { useState, useCallback, useRef } from 'react'
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect } from "@react-navigation/native"
import { Button, Icon, Image } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import { getFavorites } from '../../Utils/actions'

export default function Favorites({ navigation }) {
    const toastRef = useRef()

    const [userLogged, setUserLogged] = useState(false)
    const [stores, setStores] = useState([])
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
                    const response = await getFavorites()
                    setStores(response.favorites)
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

    if (!stores) {
        return <Loading isVisible={true} text="Cargando tiendas..."/>
    } else if(stores?.length === 0){
        return <NotFoundStore/>
    }

    return (
        <View style = {styles.viewBody}>
            <View style = {styles.btns}>
                <Icon
                    containerStyle = {styles.leftIcon}
                    type = "material-community"
                    name = "controller-classic-outline"
                    onPress = {() => navigation.navigate("list-favorites-games")}
                    size = {35}
                />
                <Text style = {styles.title}>Tiendas Favoritas</Text>
                <Icon
                    containerStyle = {styles.rigthIcon}
                    type = "material-community"
                    name = "controller-classic-outline"
                    onPress = {() => navigation.navigate("list-favorites-games")}
                    size = {35}
                />
            </View>
            {
                stores  ? (
                    <FlatList
                        data = {stores}
                        keyExtractor = {(item, index) => index.toString()}
                        renderItem = {(store) => (
                            <Store
                                store = {store}
                                setLoading = {setLoading}
                                toastRef = {toastRef}
                                navigation = {navigation}
                            />
                        )}
                    />
                ) : (
                    <View style = {styles.loaderStore}>
                        <ActivityIndicator size = "large"/>
                        <Text style = {{textAlign: "center"}}>
                            Cargando tiendas
                        </Text>
                    </View>
                )
            }
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Por favor espere..." />
        </View>
    )
}

function Store({ store, setLoading, toastRef, navigation}) {
    const { id, name, images } = store.item

    console.log(store)
    return(
        <View>
            <Text>{name}</Text>
        </View>
    )
}

function NotFoundStore() {
    return(
        <View style = {{ flex:1, alignItems: "center", justifyContent: "center"}}>
            <Icon type = "material-community" name = "alert-outline" size = {50}/>
            <Text style = {{ fontSize: 20, fontWeight: "bold" }}>
                Aún no tienes tiendas favoritas
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }){
    return(
        <View style = {{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type = "material-community" name = "alert-outline" size = {50}/>
            <Text style = {{ fontSize: 20, fontWeight: "bold" }}>
                Necesitas estar logueado para ver los favoritos
            </Text>
            <Button
                title = "Ir al login"
                containerStyle = {{ margin: 20, width: "80%" }}
                buttonStyle = {{ backgroundColor: "#442484"}}
                onPress = {() => navigation.navigate("login", { screen: "login" } )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor: "#f2f2f2"
    },
    leftIcon:{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    },
    rigthIcon:{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#fff",
        borderBottomRightRadius: 100,
        padding: 5,
        paddingRight: 15
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
    }
})
