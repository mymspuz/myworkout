import React from 'react'
import { Link } from 'react-router-dom'

type HeaderProps = {
    title: string
    icon: string
}

const Header: React.FC<HeaderProps> = ({
    title,
    icon}: HeaderProps) => {
    return (
        <header>
            <nav>
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo center">
                        <i className="large material-icons">{icon}</i>
                        {title}
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Header