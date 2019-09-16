import React, { useState, useEffect } from "react";
import axios from "axios";

export default () => {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    axios
      .get("/player/subs")
      .then(res => {
        setSubs(
          res.data.map((e, index) => (
            <track key={index} kind="subtitles" srcLang={e.lang} src={e.path} />
          ))
        );
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <video controls>
      <source src="http://localhost:5000/api/player/stream" type="video/mp4" />
      {subs}
    </video>
  );
};
