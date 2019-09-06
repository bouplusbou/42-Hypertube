import React, {useEffect, Fragment} from 'react';
import { Link } from 'react-router-dom';

export default function Page404Unauth(props) {

  useEffect(() => {

  }, []);

  return (
    <Fragment>
      <p>404 UnAuth</p>
      <Link to="/login">Login ?</Link>
    </Fragment>
  );
}