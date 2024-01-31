import React from 'react'

import './PackageLotDescription.css'

export default function PackageLotDescription({ lot: lot }) {
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
        if (lot.photo) {
            return <img src={'data:image/png;base64,' + lot.photo} ></img>
        } else {
            return <></>
        }
    }
}