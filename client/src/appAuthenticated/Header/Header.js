import React, { useEffect, useState, useRef, useContext } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import cloudinary from 'cloudinary-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Switch from '@material-ui/core/Switch';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import AppContext from '../../contexts/AppContext';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Header = styled.header`
    background-color: black;
    height: 70px;
    display: grid;
    grid-template-columns: 8fr 2fr 2fr;
    align-content: center;
`;
const Search = styled.section`
`;
const Account = styled.section`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
`;
const Avatar = styled.img`
  height: 50px;
  width: 50px;
  object-fit:cover;
  border-radius: ${props => props.theme.borderRadius};
  background-color: black;
  cursor: pointer;
`;
const DropDown = styled.div`
  width: 100px;
  top: 65px;
  right: 0px;
  border-radius: ${props => props.theme.borderRadius};
  background-color: black;
  position: absolute;
  padding: 30px;
  padding-bottom: 0px;
  text-align: right;
  z-index: 999999;
  box-shadow: 0 15px 25px -10px rgba(0,0,0,.25);
`;
const YourProfileLink = styled(Link)`
    color: ${props => props.theme.color.white};
    font-size: 1rem;
    font-family: Roboto;
    font-weight: 700;
    text-decoration: none;
    &:hover {
        color: ${props => props.theme.color.red};
    }
`;
const Languages = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const LogoutSection = styled.section`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Flag = styled.p`
    font-size: 2em;
`;
const StyledSwitch = styled(Switch)`
    .MuiSwitch-track {
        background-color: white;
    }
`;

export default function HeaderComp() {

    const { t, setT, EN, FR } = useContext(AppContext);
    const authToken = localStorage.getItem('authToken');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [checked, setChecked] = useState(true);

    useEffect(() => {
        let isSubscribed = true;
        const fetchData = async () => {
            try {
                const res = await axios.get(`/users/getAvatar?authToken=${authToken}`);
                if (isSubscribed) setAvatar(res.data.avatarPublicId);
            } catch(err) {
                console.log(err);
            }
        }
        if (authToken) fetchData();
        return () => isSubscribed = false;
    })

    const toggleSwitch = async () => {
        setChecked(prev => !prev);
        let newLocale = t === EN ? 'FR' : 'EN';
        const res = await axios.post(`/users/setLocale?authToken=${authToken}`, { newLocale });
        console.log(res);
        setT(prev => prev === EN ? FR : EN);
    };

    const toggleDropdown = () => setDropdownOpen(true);

    const node = useRef();

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    const handleClickOutside = e => {
        if (node.current.contains(e.target)) return;
        setDropdownOpen(false);
    };

    return (
        <Header>
            <Search></Search>
            <Account onClick={toggleDropdown}>
                <Avatar src={cloudinaryCore.url(avatar)}/>
                <FontAwesomeIcon style={{marginLeft: '10px', fontSize: '15px', color: 'white', cursor: 'pointer'}} icon={faChevronDown}/>
                { dropdownOpen &&
                    <DropDown ref={node}>
                        <YourProfileLink to="/myProfile">{t.header.profile}</YourProfileLink>
                        <Languages>
                            <Flag><span aria-label="French flag" role="img" >🇫🇷</span></Flag>
                            <StyledSwitch
                            checked={checked}
                            onChange={toggleSwitch}
                            value="checked"
                            color="default"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                            />
                            <Flag><span aria-label="British flag" role="img" >🇬🇧</span></Flag>
                        </Languages>
                    </DropDown>
                }
            </Account>
            <LogoutSection>
                <LogoutButton />
            </LogoutSection>
        </Header>
    )
}


