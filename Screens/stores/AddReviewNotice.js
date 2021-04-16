import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import { AirbnbRating } from 'react-native-ratings'
import { Button, Input } from 'react-native-elements'
import { isEmpty } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Loading from '../../components/Loading'
import { addDocumentWithOutId, getCurrentUser, getDocumentById, updateDocument } from '../../Utils/actions'
import { btn } from '../../Styles'

export default function AddReviewNotice({ navigation, route }) {
    const { idNotice } = route.params
    const toastRef = useRef()

    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [errorTitle, setErrorTitle] = useState(null)
    const [review, setReview] = useState("")
    const [errorReview, setErrorReview] = useState(null)
    const [loading, setLoading] = useState(false)

    const addReview  = async() => {
        if (!validForm()){
            return
        }

        setLoading(true)
        const user = getCurrentUser()
        const data = {
            idUser: user.uid,
            avatar: user.photoURL,
            idNotice,
            title,
            rating,
            review,
            createAt: new Date()
        }

        const responseAddReview = await addDocumentWithOutId("reviewsNews", data)
        if(!responseAddReview.statusResponse){
            setLoading(false)
            toastRef.current.show(
                "Error al enviar el comentario, por favor intentarlo mas tarde."
                , 3000
            )
            return
        }

        const responseGetNotice = await getDocumentById("news", idNotice)
        if (!responseGetNotice.statusResponse){
            setLoading(false)
            toastRef.current.show(
                "Error al obtener la noticia, por favor intentarlo mas tarde."
                , 3000
            )
            return
        }

        const notice = responseGetNotice.document
        const ratingTotal = notice.ratingTotal + rating
        const quantityVoting = notice.quantityVoting + 1
        const ratingResult = ratingTotal / quantityVoting
        const responseUpdateNotice = await updateDocument("news", idNotice, {
            ratingTotal,
            quantityVoting,
            rating: ratingResult
        })
        setLoading(false)

        if (!responseUpdateNotice.statusResponse){
            toastRef.current.show(
                "Error al actualizar la noticia, por favor intentarlo mas tarde."
                , 3000
            )
            return
        }

        navigation.goBack()
    }

    const validForm = () => {
        setErrorTitle(null)
        setErrorReview(null)
        let isValid = true

        if (!rating){
            toastRef.current.show("Debes darle una puntuación a la noticia.", 3000)
            isValid = false
        }

        if (isEmpty(title)){
            setErrorTitle("Debes ingresar un título a tu comentario.")
            isValid = false
        }

        if (isEmpty(review)){
            setErrorReview("Debes ingresar un comentario.")
            isValid = false
        }

        return isValid
    }

    return (
        <KeyboardAwareScrollView style = {styles.viewBody}>
            <View style = {styles.viewRating}>
                <AirbnbRating
                    count = {5}
                    reviews = {[ "Malo","Regular","Normal","Muy Bueno","Excelente" ]}
                    defaultRating = {0}
                    size = {35}
                    onFinishRating = {(value) => setRating(value)}
                />
            </View>
            <View style = {styles.formReview}>
                <Input
                    placeholder = "Titulo..."
                    containerStyle = {styles.input}
                    onChange = {(e) => setTitle(e.nativeEvent.text)}
                    errorMessage = {errorTitle}
                />
                <Input
                    placeholder = "comentario..."
                    containerStyle = {styles.input}
                    multiline
                    style = {styles.textArea}
                    onChange = {(e) => setReview(e.nativeEvent.text)}
                    errorMessage = {errorReview}
                />
            </View>
            <Button
                    title = "Enviar Comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress = {addReview}
                />
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Enviando Comentario"/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1
    },
    viewRating:{
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview:{
        flex: 1,
        alignItems: "center",
        margin: 10,
        borderRadius: 10,
        backgroundColor: "white",
        paddingTop: 15,
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderRightColor: "#c4c4c4",
        borderBottomColor: "#c4c4c4"
    },
    input:{
        marginBottom: 10
    },
    textArea:{
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
        alignSelf: "center"
    },
    btn: {
        ...btn.btnIn
    }
})
