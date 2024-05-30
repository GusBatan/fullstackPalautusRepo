import React from 'react'
import { Link } from 'react-router-dom'


// react component for navigation bar using react-router

const NavBar = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%'}}>
            <nav>
                <Link to="/">Home</Link>{' '}
                <Link to="/users">Users</Link>
            </nav>
        </div>
    )
}

export default NavBar