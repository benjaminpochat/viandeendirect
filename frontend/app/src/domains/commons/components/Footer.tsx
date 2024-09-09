import React, { useEffect, useState } from "react"
import './Footer.css'
import contact from '../../../resources/images/contact.svg'
import { UrlService } from "../service/UrlService.ts"
import GeneralTermsAndConditions from "./GeneralTermsAndConditions.tsx"

export default function Footer() {
    const [customerFrontendUrl, setCustomerFrontendUrl] = useState<String | undefined>(undefined)
    const [producerFrontendUrl, setProducerFrontendUrl] = useState<String | undefined>(undefined)
    const [generalTermsAndConditionsShown, setGeneralTermsAndConditionsShown] = useState<boolean>(false)

    useEffect(() => {
        const loadUrls = async () => {
            const urlService = new UrlService()
            setCustomerFrontendUrl(await urlService.getCustomerFrontentUrl())
            setProducerFrontendUrl(await urlService.getProducerFrontentUrl())
        }
        loadUrls()
    })

    function displayGeneralTermsAndConditions() {
        if (generalTermsAndConditionsShown) {
            return <GeneralTermsAndConditions closeCallback={() => setGeneralTermsAndConditionsShown(false)}
            />
        }
        return <></>
    }

    return <>
        <div className="footer">
            <div>
                <div className="footer-item"><a onClick={() => setGeneralTermsAndConditionsShown(true)}>Conditions générales de vente</a></div>
                <div className="footer-item"><a href={customerFrontendUrl}>Espace clients</a></div>
                <div className="footer-item"><a href={producerFrontendUrl}>Espace éleveurs</a></div>
            </div>
            <div className="footer-item">
                <div>SAS ESTEBEN</div>
                <div>5 rue des Marronniers 57580 BECHY</div>
                <div>Email : <a href="mailto:la.viande.en.direct@gmail.com">la.viande.en.direct@gmail.com</a></div>
                <div className="footer-contact">
                <div>Téléphone : </div>
                <img src={contact}/>
                </div>
                <div>Siren : 901293399</div>
                <div>N° TVA : FR6890129339900019</div>
            </div>
            <div className="footer-item">
                <div>Icones par <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> sur <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            </div>
        </div>
        {displayGeneralTermsAndConditions()}
    </>
}