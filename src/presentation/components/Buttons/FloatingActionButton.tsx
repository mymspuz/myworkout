import React from 'react'
import M from 'materialize-css'
import FloatingActionButtonOptions = M.FloatingActionButtonOptions
import {Link} from 'react-router-dom'

const FloatingActionButton: React.FC = () => {

    const elem = document.querySelectorAll('.fixed-action-btn')
    const options: Partial<FloatingActionButtonOptions> = {
        direction: 'left',
        hoverEnabled: false
    }
    M.FloatingActionButton.init(elem, options)

    return (
        <div className="fixed-action-btn">
            <a className="btn-floating btn-large red">
                <i className="large material-icons">menu</i>
            </a>
            <ul>
                <li><Link to='/weights' className="btn-floating red"><i className="material-icons">cake</i></Link></li>
                <li><Link to='/reports' className="btn-floating yellow darken-1"><i className="material-icons">insert_chart</i></Link></li>
                <li><Link to='/' className="btn-floating green"><i className="material-icons">view_comfy</i></Link></li>
                <li><Link to='/logout' className="btn-floating blue"><i className="material-icons">account_circle</i></Link></li>
            </ul>
        </div>
    )
}

export default FloatingActionButton