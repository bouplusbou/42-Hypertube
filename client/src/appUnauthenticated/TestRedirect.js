import React, {useEffect} from 'react';

export default function TestRedirect(props) {

// only to redirect, maybe use HOC instead ?!

  useEffect(() => {
    if (props.location.search) {
      let regex = /(\?authToken=)(?<authToken>\w*)/;
      let str = props.location.search;
      let groups = str.match(regex).groups;
      if (groups.authToken) {
        localStorage.removeItem('authToken');
        localStorage.setItem('authToken', groups.authToken);
      }
    }
  }, [props.location.search, props.history]);

  return (
      <p>You are connected</p>
  );
}