import React from 'react'
import { AppBar, Box, Button, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { useCookies } from 'react-cookie'
import { useKeycloak } from '@react-keycloak/web'

import { Sale } from '@viandeendirect/api/dist/models/Sale'
import { Customer } from '@viandeendirect/api/dist/models/Customer'
import { User } from '@viandeendirect/api/dist/models/User'

import { ApiInvoker } from '../../api/ApiInvoker.ts'
import { AuthenticationService } from '../../authentication/service/AuthenticationService.ts'

import CustomerOrderForm from '../../domains/sale/views/CustomerOrderForm.tsx'
import CustomerCreationForm from '../../domains/customer/views/CustomerCreationForm.tsx'
import Welcome from '../../domains/welcome/Welcome.tsx'
import { Login, Logout } from '@mui/icons-material'
import NotAuthorizedForProducers from '../../authentication/views/NotAuthorizedForProducers.tsx'
import { Outlet, useNavigate } from 'react-router-dom'


export default function CustomerLayout() {

    const WELCOME = 'WELCOME'
    const ORDER_CREATION = 'ORDER_CREATION'
    const NOT_AUTHORIZED_FOR_PRODUCER = 'NOT_AUTHORIZED_FOR_PRODUCER'

    const apiInvoker = new ApiInvoker()
    const {keycloak, initialized} = useKeycloak()
    const authenticationService = new AuthenticationService(keycloak)

    const [mainContent, setMainContent] = useState(WELCOME)
    const [context, setContext] = useState(undefined)
    const [cookies, setCookie, removeCookie] = useCookies(['pendingOrder']);
    const [customer, setCustomer] = useState<Customer>(undefined)
    const navigate = useNavigate()

    useEffect(() => {
        if (initialized) {
            if (authenticationService.isAuthenticated() && !customer) {
                apiInvoker.callApiAuthenticatedly(
                    keycloak, 
                    api => api.getCustomer, 
                    {"email": authenticationService.getCurrentUserEmail()}, 
                    aCustomer => initCustomer(aCustomer), 
                    error => {
                        if (error.status === 409) {
                            setMainContent(NOT_AUTHORIZED_FOR_PRODUCER)
                        } else {
                            console.error(error)
                        }
                    })
            }
        }
    }, [initialized])

    function initCustomer(customer :Customer) {
        if (customer) {
            setCustomer(customer)
        } else {
            const customer: Customer = {}
            customer.user = {}
            customer.user.lastName = authenticationService.getCurrentUserLastName()
            customer.user.firstName = authenticationService.getCurrentUserFirstName()
            customer.user.email = authenticationService.getCurrentUserEmail()
            setCustomer(customer)
        }
    }

    function createOrder(sale: Sale) {
        setContext(sale)
        /*setMainContent(ORDER_CREATION)*/
        navigate('/order/creation')
    }

    function displayAuthenticationButton(): React.ReactNode {
        if (authenticationService.isAuthenticated()) {
            return <>
                <Typography>{authenticationService.getCurrentUserFirstName() } {authenticationService.getCurrentUserLastName()}</Typography>
                <IconButton onClick={keycloak.logout} color="inherit">
                    <Logout/>
                </IconButton>
            </>
        } 
        return <IconButton onClick={keycloak.login} color="inherit">
            <Login/>
        </IconButton>
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Viande en direct
                    </Typography>
                    {displayAuthenticationButton()}
                </Toolbar>
            </AppBar>
            <Outlet/>
        </Box>
    )
}
