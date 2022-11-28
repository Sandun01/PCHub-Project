import React, { Component } from 'react'

export default class Footer extends Component {
    render() {
        return (
            <footer className="text-center text-lg-start" style={{ backgroundColor: '#0A1F35'}}>
                <div className='text-center py-3' 
                    style={{ 
                            color: '#A4A4A4',
                        }}
                    >
                    Copyright @ 2021S2_REG_WE_09
                </div>
            </footer>
        )
    }
}
