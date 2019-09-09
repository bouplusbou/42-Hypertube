import React, { useContext } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import styled from 'styled-components';
import { actionLogout } from '../actions/authActions';
import AppContext from '../contexts/AppContext';

export default function LogoutButton() {

    const userState = useContext(AppContext);

    const LogoutButton = styled.button`
        display: inline-block;
        padding: 8px 10px;
        border-radius: 10px;
        background-color: ${props => props.theme.color.red};
        color: ${props => props.theme.color.white};
        font-size: 1rem;
        cursor: pointer;
        text-decoration: none;
        transition: background 250ms ease-in-out, 
                    transform 150ms ease;
        -webkit-appearance: none;
        -moz-appearance: none;
        &:hover,
        &:focus {
            background: white;
            color: ${props => props.theme.color.red};
        }
        &:focus {
            outline: 1px solid #fff;
            outline-offset: -4px;
        }
        &:active {
            transform: scale(0.99);
        }
        p {
            margin: 0;
        }
    `;

    const handleLogout = () => {
        userState.toggleConnected();
        actionLogout();
    };

    return (
        <BrowserRouter>
            <Link
                to="/"
                onClick={handleLogout}
            >
                <LogoutButton>
                    <p>Logout</p>
                </LogoutButton>
            </Link>
        </BrowserRouter>
    );
}