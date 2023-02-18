export const makeUrlPrefix = () => {
  let url_prefix;
  if (window.location.host === "localhost:3000") {
    // CASE localhost react development server
    /*
    // port 3000 is local react development server
    // port 3001 is default express server port
    url_prefix = 'http://localhost:3001';
    // example 'http://localhost:3001'
    */
    // url_prefix = 'http://localhost:3033'; // LOCAL JSON SERVER
    url_prefix = 'http://localhost/json-server-php'; // LOCAL JSON SERVER PHP
  } else {
    /*
    // CASE react app build is hosted inside public folder on real backend
    // no port changes because port is the same for frontend and backend
    url_prefix = window.location.protocol + '//' + window.location.host;
    // example 'http://mywebsite.com'
    // example 'http://localhost:3001'
    // example 'http://mywebsite.com:3001'
    */
    // ZA BACKEND NA HEROKU
    // examle url_prefix = 'http://nekaadresa.herokuapp.com';
    url_prefix = 'https://social-json-backend.herokuapp.com';
  }
  return url_prefix;
};