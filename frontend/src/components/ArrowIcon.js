import React from 'react'

const square1 =  {
    height: 3,
    width: 21,
    backgroundColor: '#A0A0A0',
    transform: 'translateY(8px) translateX(-9px) rotate(90deg)',
    borderRadius: 25,
}
const square2 = {
    height: 3,
    width: 21,
    backgroundColor: '#A0A0A0',
    transform: 'translateY(14px)',
    borderRadius: 25,
}
const whole = {
    height: 21,
    width: 21,
    transform: 'scale(1) rotate(-45deg)',
    display: 'inline-block',
    margin: 5
}

const ArrowIcon = ({ id }) => {
    return(
        <div className="d-flex justify-content-center" id={id} style={{ transformOrigin: '50% 60%' }}>
            <div style={whole}>
                <div style={square1}></div>
                <div style={square2}></div>
            </div>
        </div>
    )
}

export default ArrowIcon