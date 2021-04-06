import React, { useState } from 'react'
import { map } from 'lodash'
import { StyleSheet, Text, View } from 'react-native'
import { Button, BottomSheet, Icon, ListItem } from 'react-native-elements'

import Modal from '../Modal'
import ChangeDisplayNameForm from './ChangeDisplayNameForm'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePasswordForm from './ChangePasswordForm'

export default function AccountOptions({ user, toastRef, setReloadUser, isVisible, setIsVisible }) {
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const generateoptions = () => {
        return[
            {
                title: "Cambiar Nombres y Apellidos",
                iconNameLeft: "account-convert",
                iconColorLeft: "#9db6e6",
                iconNameRight: "chevron-right",
                iconColorRight: "#9db6e6",
                onPress: () => selectedComponent("displayName")
            },
            {
                title: "Cambiar Email",
                iconNameLeft: "email-sync",
                iconColorLeft: "#9db6e6",
                iconNameRight: "chevron-right",
                iconColorRight: "#9db6e6",
                onPress: () => selectedComponent("email") 
            },
            {
                title: "Cambiar Contraseña",
                iconNameLeft: "lock-reset",
                iconColorLeft: "#9db6e6",
                iconNameRight: "chevron-right",
                iconColorRight: "#9db6e6",
                onPress: () => selectedComponent("password")   
            },
            {
                title: "Volver",
                onPress: () =>  setIsVisible(false)
            }
        ]
    }

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName = {user.displayName}
                        setShowModal = {setShowModal}
                        toastRef = {toastRef}
                        setReloadUser = {setReloadUser}
                    />
                )
                break
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email = {user.email}
                        setShowModal = {setShowModal}
                        toastRef = {toastRef}
                        setReloadUser = {setReloadUser}
                    />
                )
                break
            case "password":
                setRenderComponent(
                    <ChangePasswordForm
                        setShowModal = {setShowModal}
                        toastRef = {toastRef}
                    />
                )
                break
        }
        setShowModal(true)
    }

    const menuOptions = generateoptions();

    return (
        <BottomSheet
            isVisible = {isVisible}
            containerStyle = {{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
            {
                map(menuOptions, (menu, index) => (
                    <ListItem
                        key={index}
                        style={styles.menuItem}
                        onPress={menu.onPress}
                    >
                        <Icon
                            type="material-community"
                            name={menu.iconNameLeft}
                            color={menu.iconColorLeft}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.iconNameRight}
                            color={menu.iconColorRight}
                        />
                    </ListItem>
                ))
            }
            <Modal isVisible={showModal} setVisible={setShowModal}>
                {
                    renderComponent
                }
            </Modal>
        </BottomSheet>
    )
}

const styles = StyleSheet.create({
    menuItem:{
        borderBottomWidth: 1,
        borderBottomColor: "#a7bfd3"
    }
})
