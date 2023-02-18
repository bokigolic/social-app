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
    // OVDE BIRAMO PUTANJU DO BACKEND (trba nam za APi url-ove)
    // url_prefix = 'http://localhost:3033'; // LOCAL JSON SERVER
    // a) baza na XAMPP-u
    // url_prefix = 'http://localhost/json-server-php'; // LOCAL JSON SERVER PHP u folderu json-server-php na XAMPP-u
    // b) Baza na socialapp.bojangolic.com/api
    url_prefix = 'https://socialapp.bojangolic.com/api'; // koristimo bazu vec okacenu na hostgator
  } else {
    // CASE react app build is hosted inside public folder on real backend
    // a)
    // no port changes because port is the same for frontend and backend
    // url_prefix = window.location.protocol + '//' + window.location.host; // univerzalno
    // example 'http://mywebsite.com'
    // example 'http://localhost:3001'
    // example 'http://mywebsite.com:3001'
    // b) ZA BACKEND NA HEROKU
    // examle url_prefix = 'http://nekaadresa.herokuapp.com';
    // url_prefix = 'https://social-json-backend.herokuapp.com'; // backend na heroku
    // c) json-server-php backend u /api folderu na hostingu
    url_prefix = window.location.protocol + '//' + window.location.host + '/api'; // u folderu /api na hostingu
  }
  return url_prefix;
};