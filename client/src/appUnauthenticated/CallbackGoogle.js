// import React, { useEffect } from 'react';
// import axios from 'axios';

// export default function CallbackGoogle(props) {
//     console.log(props.location.search);
//     let regex = /(\?code=)(?<code>.*)(&)/;
//     let str = props.location.search;
//     let groups = str.match(regex).groups;

//     useEffect(() => {
//       axios.post(`/auth/google/accessToken`, { accessToken: groups.code })
//     }, [groups.code]);

//   return (
//       <div>Hello your Google OAuth 2.0 'code' is {groups.code} </div>
//   );
// }
