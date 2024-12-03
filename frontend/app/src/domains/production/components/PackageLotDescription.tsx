import React, { useEffect, useState } from 'react'

import './PackageLotDescription.css'
import { ApiBuilder } from '../../../api/ApiBuilder.ts'
import { Image } from '@viandeendirect/api/dist/models/Image';

export default function PackageLotDescription({ lot: lot, production: production }) {

    const apiBuilder = new ApiBuilder()

    const [photo, setPhoto] = useState<Image |undefined>(undefined)

    useEffect(() => {
        const loadPhoto = async () => {
            const api = await apiBuilder.getAnonymousApi()
            const image = await api.getProductLotPhoto({productionId: production.id, lotId: lot.id})
            setPhoto(image)            
        }
        loadPhoto()
    }, [])


    return <div className='package-lot'>
        <div className='package-lot__label'>{lot.label}</div>
        <div className='package-lot__description'>{lot.description}</div>
        <span className='icon euro-icon package-lot__icon'></span>
        <div className='package-lot__total_price'>{lot.unitPrice * lot.netWeight} €<sup>TTC</sup></div>
        <div className='package-lot__unit_price'>({lot.unitPrice} €<sup>TTC</sup>/kg)</div>
        <span className='icon weight-icon package-lot__icon'></span>
        <div className='package-lot__weight'>~{lot.netWeight} kg</div>
        {getImage()}
    </div>

    function getImage() {
        if (photo) {
            return <img className='package-lot__image' src={'data:image/png;base64,' + photo.content} ></img>
        } else {
            return <></>
        }
    }
}