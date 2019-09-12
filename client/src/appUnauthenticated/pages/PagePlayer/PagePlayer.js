import React from "react";

export default () => {
  return (
    <video controls>
      <source
        src="http://localhost:5000/api/player/stream"
        type="video/mp4"
      ></source>
    </video>
  );
};
