import React from 'react'
import './PieChart.css'

export default function PieChart({percentage: percentage, description: description}) {
    return <div className="pie-chart">
            <div className="pie-chart__graphic" style={{ backgroundImage: getPieChartBackgroundImage()}}></div>
            <div className="pie-chart__description"><div>{description}</div></div>
        </div>

    function getPieChartBackgroundImage() {
        const angle = 360 * percentage / 100
        return 'conic-gradient(#1976d2 ' + angle + 'deg , lightgrey ' + angle + 'deg 360deg)'
    }
}