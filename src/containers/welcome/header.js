import React from 'react';
import { Link } from 'react-router-dom';


export function AppLogo() {
    return (
        <h4>medicus</h4>
    );
}


export default function HeaderBar(props) {
    return (
        <header className="row md-wc-hbar">
            <nav className="col navbar navbar-expand-sm navbar-dark">
                <Link to="/" className="navbar-brand d-inline d-sm-none">
                    <AppLogo />
                </Link>
            </nav>
        </header>
    );
}
