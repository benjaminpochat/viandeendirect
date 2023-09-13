import { Button, ButtonGroup, Typography } from "@mui/material"

function ProductionForm({setProductionsCurrentAction}) {
    return <>
        <Typography>Nouvelle production</Typography>
        <ButtonGroup>
            <Button variant="contained" size="small" onClick={() => validate()}>Enregistrer</Button>
            <Button variant="outlined" size="small" onClick={() => cancel()}>Abandonner</Button>
        </ButtonGroup>
    </>

    function validate() {
        setProductionsCurrentAction('NONE')
    }

    function cancel() {
        setProductionsCurrentAction('NONE')
    }
}


export default ProductionForm