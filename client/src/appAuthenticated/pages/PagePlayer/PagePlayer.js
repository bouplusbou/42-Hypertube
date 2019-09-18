import React, { useState, useEffect, useContext, Fragment } from "react";
import axios from "axios";
import AppContext from '../../../contexts/AppContext';
import styled from 'styled-components';

const Global = styled.section`
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Video = styled.video`
  max-width: 100vw;
  :focus {
    outline: none;
  }
`;

export default () => {
  const { magnet } = useContext(AppContext);
  const [subs, setSubs] = useState([]);
  const [player, setPlayer] = useState(false);
  const [setup, setSetup] = useState(false);
  const authToken = localStorage.getItem('authToken');

  // useEffect(() => {
  //   const sendMagnet = async () => {
  //     try {
  //       const res = await axios.post(`/player/stream?authToken=${authToken}`, { magnet });
  //       console.log(res);
  //       setSetup(true);
  //     } catch(err) {
  //       console.log(err);
  //     }
  //   };
  //   if (magnet) sendMagnet();
  // }, [authToken, magnet]);

  useEffect(() => {
    axios
      .get(`/player/subs?id=${magnet.imdbId}`)
      .then(res => {
        setSubs(
          res.data.map((e, index) => (
            <track key={index} kind="subtitles" srcLang={e.lang} src={e.path} />
          ))
        );
        setPlayer(true);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <Global>
      <Video controls>
          <source src={`http://localhost:5000/api/player/stream?provider=${magnet.magnet.source}&id=${magnet.imdbId}&magnet=${magnet.magnet.magnet}`} type="video/mp4" />
          {player && subs}
      </Video>
    </Global>
  );
};
