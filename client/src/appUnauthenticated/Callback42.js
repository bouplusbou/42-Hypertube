import React, { useEffect } from 'react';
import axios from 'axios';

export default function Callback42(props) {

    let regex = /(\?code=)(?<code>\w*)/;
    let str = props.location.search;
    let groups = str.match(regex).groups;

    useEffect(() => {
      axios.post(`/auth/42/code`, { code: groups.code })
    }, []);

  return (
      <div>Hello your 42 'code' is {groups.code} </div>
  );
}
