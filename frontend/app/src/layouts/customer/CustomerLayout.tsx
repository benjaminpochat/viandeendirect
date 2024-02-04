import React from 'react'
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import Welcome from '../../domains/welcome/Welcome.tsx'
import CustomerOrderForm from '../../domains/sale/views/CustomerOrderForm.tsx'
import Sale from 'viandeendirect_eu/dist/model/Sale.js'
import { useCookies } from 'react-cookie'

export default function CustomerLayout() {

    const WELCOME = 'WELCOME'
    const ORDER_CREATION = 'ORDER_CREATION'

    const [mainContent, setMainContent] = useState(WELCOME)
    const [context, setContext] = useState(undefined)

    const [cookies, setCookie, removeCookie] = useCookies(['pendingOrder']);

    useEffect(() => {
        if (cookies.pendingOrder) {
            createOrder({id: cookies.pendingOrder.sale.id})
        }
    }, [])


    function renderMainContent() {
        switch (mainContent) {
          case 'WELCOME' : return <Welcome createOrderCallback={sale => createOrder(sale)}></Welcome>
          case 'ORDER_CREATION' : return <CustomerOrderForm returnCallback={() => setMainContent(WELCOME)} sale={context} ></CustomerOrderForm>
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
