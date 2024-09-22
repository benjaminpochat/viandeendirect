import { Button, Dialog, DialogActions } from "@mui/material"
import React, { useState } from "react"

export default function VisitFarmButton({producer}) {
    const [slideShowDisplayed, setSlideShowDisplayed] = useState<boolean>(false)

    if (producer?.slideShowUrl) {
        return <>
            <Dialog open={slideShowDisplayed}
                fullScreen
                onClose={() => setSlideShowDisplayed(false)}>
                <iframe 
                    src={producer.slideShowUrl} 
                    allowFullScreen={true}
                    width="100%" 
                    height="100%"/>
                <DialogActions>
                    <Button variant='contained' onClick={() => setSlideShowDisplayed(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>
            <Button variant='outlined' size='small' onClick={() => setSlideShowDisplayed(true)}>Je visite la ferme</Button>
        </>
    }
    return <></>
}