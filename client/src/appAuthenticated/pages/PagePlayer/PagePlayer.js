import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import AppContext from '../../../contexts/AppContext';
import styled from 'styled-components';
import { getThemeProps } from "@material-ui/styles";

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

const LinkBack = styled(Link)`
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;

export default (props) => {
  const { currentMovieInfo } = useContext(AppContext);
  const [subs, setSubs] = useState([]);
  const [player, setPlayer] = useState(false);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (currentMovieInfo && authToken) {
      axios
        .get(`/player/subs?id=${currentMovieInfo.imdbId}&authToken=${authToken}`)
        .then(res => {
          setSubs(
            res.data.map((e, index) => (
              <track key={index} kind="subtitles" srcLang={e.lang} src={e.path} />
            ))
          );
          if (res.status === 200) setPlayer(true);
        })
        .catch(err => console.log(err));
    }
  }, [authToken, currentMovieInfo, currentMovieInfo.imdbId]);

  return (
    <Global>
      {(currentMovieInfo && currentMovieInfo.magnet.source && player) ? 
        <Video controls>
          <source src={`http://localhost:5000/api/player/stream?provider=${currentMovieInfo.magnet.source}&id=${currentMovieInfo.imdbId}&magnet=${currentMovieInfo.magnet.magnet}`} type="video/mp4" />
          {subs}
        </Video>
        :
        <LinkBack to={`/movies/${props.match.params.imdbId}`}>Go back to the movie page</LinkBack>
      }
    </Global>
  );
};
