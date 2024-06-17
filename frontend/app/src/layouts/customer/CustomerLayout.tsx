import React from 'react'
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { useCookies } from 'react-cookie'
import { useKeycloak } from '@react-keycloak/web'

import Sale from 'viandeendirect_eu/dist/model/Sale.js'
import Customer from 'viandeendirect_eu/dist/model/Customer.js'
import User from 'viandeendirect_eu/dist/model/User.js'

import { ApiInvoker } from '../../api/ApiInvoker.ts'
import { AuthenticationService } from '../../authentication/AuthenticationService.ts'

import CustomerOrderForm from '../../domains/sale/views/CustomerOrderForm.tsx'
import CustomerCreationForm from '../../domains/customer/views/CustomerCreationForm.tsx'
import Welcome from '../../domains/welcome/Welcome.tsx'


export default function CustomerLayout() {

    const WELCOME = 'WELCOME'
    const ORDER_CREATION = 'ORDER_CREATION'
    const CUSTOMER_CREATION = 'CUSTOMER_CREATION'

    const apiInvoker = new ApiInvoker()
    const {keycloak, initialized} = useKeycloak()
    const authenticationService = new AuthenticationService(keycloak)

    const [mainContent, setMainContent] = useState(WELCOME)
    const [context, setContext] = useState(undefined)
    const [cookies, setCookie, removeCookie] = useCookies(['pendingOrder']);
    const [customer, setCustomer] = useState<Customer>(undefined)

    useEffect(() => {
        if (initialized) {
            if (authenticationService.isAuthenticated() && !customer) {
                apiInvoker.callApiAuthenticatedly(keycloak, api => api.getCustomer, {"email": authenticationService.getCurrentUserEmail()}, aCustomer => initCustomer(aCustomer), console.error)
            }
        }
    }, [initialized])

    function initCustomer(customer: Customer) {
        if (customer) {
            setCustomer(customer)
        } else {
            const customer = new Customer()
            customer.user = new User()
            customer.user.lastName = authenticationService.getCurrentUserLastName()
            customer.user.firstName = authenticationService.getCurrentUserFirstName()
            customer.user.email = authenticationService.getCurrentUserEmail()
            setCustomer(customer)
        }
    }

    function renderMainContent() {
        if(authenticationService.isAuthenticated() && customer && !customer.id) {
            return <CustomerCreationForm customer={customer} returnCallback={newCustomer => setCustomer(newCustomer)}></CustomerCreationForm>
        } else if(cookies.pendingOrder ) {
            return <CustomerOrderForm returnCallback={() => setMainContent(WELCOME)} sale={{id: cookies.pendingOrder.sale.id}} ></CustomerOrderForm>
        }
        switch (mainContent) {
            case WELCOME: return <Welcome createOrderCallback={sale => createOrder(sale)}></Welcome>
            case ORDER_CREATION: return <CustomerOrderForm returnCallback={() => setMainContent(WELCOME)} sale={context} ></CustomerOrderForm>
        }
        
    }
  
    function createOrder(sale: Sale) {
        setContext(sale)
        setMainContent(ORDER_CREATION)
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
                </Toolbar>
            </AppBar>
            {renderMainContent()}
        </Box>
    )
}
