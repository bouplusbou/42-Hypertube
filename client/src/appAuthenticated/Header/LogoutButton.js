import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { actionLogout } from '../../actions/authActions';
import AppContext from '../../contexts/AppContext';

export default function LogoutButton() {

    const userState = useContext(AppContext);

    const LogoutButton = styled.button`
        display: inline-block;
        padding: 8px 10px;
        border-radius: 3px;
        border: solid 1px gray;
        background-color: ${props => props.theme.color.black};
        color: gray;
        font-size: 1rem;
        cursor: pointer;
        text-decoration: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        &:hover {
            background: ${props => props.theme.color.red};
            color: ${props => props.theme.color.white};
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
        <Link
            to="/"
            onClick={handleLogout}
        >
            <LogoutButton>
                <p>Logout</p>
            </LogoutButton>
        </Link>
    );
}