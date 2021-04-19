import { firebaseApp } from './firebase'
import * as firebase from 'firebase'
import 'firebase/firestore'
import { map } from 'lodash'
import { FireSQL } from 'firesql' 

import { fileToBlob } from './helpers'

const db = firebase.firestore(firebaseApp)
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

export const isUserLogged = () => {
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) => {
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () =>{
    return firebase.auth().currentUser
}

export const CloseSession = () => {
    return firebase.auth().signOut()
}

export const registerUser = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado."
    }
    return result
}

export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.error = "Usuario o contraseña no válidos."
        result.statusResponse = false
    }
    return result
}

export const uploadImage = async(image, path, name) => {
    const result = { statusResponse: false, error: null, url: null}
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)
    
    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async(data) => {
    const result = { statusResponse: true, error: null}
    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const reAuthenticate = async (password) => {
    const result = {statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)

    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateEmail = async (email) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updatePassword = async(password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const addDocumentWithOutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getStores = async(limitStores) => {
    const result = { statusResponse: true, error: null, stores: [], startStore: null }
    try {
        const response = await db
        .collection("stores")
        .orderBy("createAdd", "desc")
        .limit(limitStores)
        .get()  
        if (response.docs.length > 0) {
            result.startStore = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const store = doc.data()
            store.id = doc.id
            result.stores.push(store)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getMoreStores = async(limitStores, startStore) => {
    const result = { statusResponse: true, error: null, stores: [], startStore: null }
    try {
        const response = await db
        .collection("stores")
        .orderBy("createAdd", "desc")
        .startAfter(startStore.data().createAdd)
        .limit(limitStores)
        .get()  
        if (response.docs.length > 0) {
            result.startStore = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const store = doc.data()
            store.id = doc.id
            result.stores.push(store)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id = response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateDocument = async(collection, id, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getStoreReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviews")
            .where("idStore", "==", id)
            .get()
        response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getIsFavorite = async(idStore) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
        const response = await db
        .collection("favorites")
        .where("idStore", "==", idStore)
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        result.isFavorite = response.docs.length > 0
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const removeFavorites = async(idStore) => {
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
        .collection("favorites")
        .where("idStore", "==", idStore)
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        response.forEach(async(doc) => {
            const favoriteId = doc.id
            await db.collection("favorites").doc(favoriteId).delete()
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getFavorites = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
        const response = await db
            .collection("favorites")
            .where("idUser", "==", getCurrentUser().uid)
            .get()
        await Promise.all(
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const store = await getDocumentById("stores", favorite.idStore)
                if (store.statusResponse) {
                    result.favorites.push(store.document)
                }
            })
        )
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getNews = async(limitNews) => {
    const result = { statusResponse: true, error: null, news: [], startNew: null }
    try {
        const response = await db
        .collection("news")
        .where("category", "==", "Tiendas")
        .limit(limitNews)
        .get()
        if (response.docs.length > 0) {
            result.startNew = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const notice = doc.data()
            notice.id = doc.id
            result.news.push(notice)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getMoreNews = async(limitNews, startNew) => {
    const result = { statusResponse: true, error: null, news: [], startNew: null }
    try {
        const response = await db
        .collection("news")
        .where("category", "==", "Tiendas")
        .orderBy("createAt", "desc")
        .startAfter(startNew.data().createAt)
        .limit(limitNews)
        .get()  
        if (response.docs.length > 0) {
            result.startNew = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const notice = doc.data()
            notice.id = doc.id
            result.news.push(notice)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getFavoritesNews = async() => {
    const result = { statusResponse: true, error: null, favorites: [] }
    try {
        const response = await db
        .collection("favoritesNews")
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        // const storesId = []
        // response.forEach(async(doc) => {
        //     const favorite = doc.data()
        //     storesId.push(favorite.idStore)
        // })
        // await Promise.all(
        //     map(storesId, async(storeId) => {
        //         const response2 = await getDocumentById("stores", storeId)
        //         if(response2.statusResponse)
        //         {
        //             result.favorites.push(response2.document)
        //         }
        //     })
        // )

        await Promise.all(
            map(response.docs, async(doc) => {
                const favorite = doc.data()
                const responseGetNotice = await getDocumentById("news", favorite.idNotice)
                result.favorites.push(responseGetNotice.document)
            })
        )
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getIsFavoriteNotice = async(idNotice) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
        const response = await db
        .collection("favoritesNews")
        .where("idNotice", "==", idNotice)
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        result.isFavorite = response.docs.length > 0
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const removeFavoritesNews = async(idNotice) => {
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
        .collection("favoritesNews")
        .where("idNotice", "==", idNotice)
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        response.forEach(async(doc) => {
            const favoriteId = doc.id
            await db.collection("favoritesNews").doc(favoriteId).delete()
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getNoticeReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviewsNews")
            .where("idNotice", "==", id)
            .get()
        response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getTopStore = async(limit) => {
    const result = { statusResponse: true, error: null, stores: [] }
    try {
        const response = await db
        .collection("stores")
        .orderBy("rating", "desc")
        .limit(limit)
        .get()
        response.forEach((doc) => {
            const store = doc.data()
            store.id = doc.id
            result.stores.push(store)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const searchStore = async(criteria) => {
    const result = { statusResponse: true, error: null, stores: [] }
    try {
        result.stores = await fireSQL.query(`SELECT * FROM stores WHERE name LIKE '${criteria}%'`)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getGames = async(limitGames) => {
    const result = { statusResponse: true, error: null, games: [], startGame: null }
    try {
        const response = await db
            .collection("games")
            .orderBy("createAt", "desc")
            .limit(limitGames)
            .get()
        if (response.docs.length > 0) {
            result.startGame = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const game = doc.data()
            game.id = doc.id
            result.games.push(game)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getMoreGames = async(limitGames) => {
    const result = { statusResponse: true, error: null, Games: [], startGame: null }
    try {
        const response = await db
            .collection("games")
            .orderBy("createAt", "desc")
            .startAfter(startRestaurant.data().createAt)
            .limit(limitGames)
            .get()
        if (response.docs.length > 0) {
            result.startGame = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const game = doc.data()
            game.id = doc.id
            result.games.push(game)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getGameReviews = async(id) => {
    const result = { statusResponse: true, error: null, reviews: [] }
    try {
        const response = await db
            .collection("reviews")
            .where("idGame", "==", id)
            .get()
        response.forEach((doc) => {
            const review = doc.data()
            review.id = doc.id
            result.reviews.push(review)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getTopGames = async(limit) => {
    const result = { statusResponse: true, error: null, games: [] }
    try {
        const response = await db
        .collection("games")
        .orderBy("rating", "desc")
        .limit(limit)
        .get()
        response.forEach((doc) => {
            const game = doc.data()
            game.id = doc.id
            result.games.push(game)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const removeFavoriteGame = async(idGame) => {
    const result = { statusResponse: true, error: null }
    try {
        const response = await db
        .collection("favoritesGames")
        .where("idGame", "==", idGame)
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        response.forEach(async(doc) => {
            const favoriteId = doc.id
            await db.collection("favoritesGames").doc(favoriteId).delete()
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const getIsFavoriteGame = async(idGame) => {
    const result = { statusResponse: true, error: null, isFavorite: false }
    try {
        const response = await db
        .collection("favoritesGames")
        .where("idGame", "==", idGame)
        .where("idUser", "==", getCurrentUser().uid)
        .get()
        result.isFavorite = response.docs.length > 0
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}
