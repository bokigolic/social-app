<?php
// Allow from any origin
if (isset($_SERVER["HTTP_ORIGIN"])) {
  // You can decide if the origin in $_SERVER['HTTP_ORIGIN'] is something you want to allow, or as we do here, just allow all
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
  // No HTTP_ORIGIN set, so we allow any. You can disallow if needed here
  header("Access-Control-Allow-Origin: *"); // MK
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 600"); // Cache results of a preflight request for 10 minutes:
// header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, X-Requested-With'); // MK
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  // Access-Control headers are received during OPTIONS requests
  // https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
  if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"])) {
    header("Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE"); // Make sure you remove those you do not want to support
  }
  if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"])) {
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  }
  // Just exit with 200 OK with the above headers for OPTIONS method
  exit(0);
}
// From here, handle the request as it is ok


// -----START script-----
$this_script_name_version = 'json-server-php.php v0.3.9 2023-02-17 beta...';
/*
json-server-php.php v0.3.9
SOLUTION PROFILE: zt_php_2023_rev1
*/


// -----CONFIG
$config_db_file_path_relative = "db/db.json"; // db.json path relative to this file;


// -----GLOBAL VARIABLES
$route_is_api = false; // API true / HTML false

// res
$res_status = null;
$res_type_is_json = false;
$res_data = []; // default is array to be easier later to add some items in it.

// response cases
$is_api_success_res = false; // API res_status 200 OK
$is_api_error_not_found = false; // ERROR 404 Not Found
$is_error_other = false; // ERROR 500


// -----FILES...

// $data = json_decode(file_get_contents('filename.json'), true);

$fs_path = $_SERVER['SCRIPT_FILENAME'];
$fs_directory = dirname($fs_path) . "/"; // The best // file system folder
$db_file_path = $fs_directory . $config_db_file_path_relative; // $fs_directory  vec sadrzi kosu crtu na kraju... ??? TODO mozda nije najbolje resenje a mozda je dobro jer je u pitanju relative path?!
$db_json_raw_data = file_get_contents($db_file_path);
$db_data = json_decode($db_json_raw_data, true); // Adding the true returns the result as an array and not an stdClass. // db json decoded


// -----FUNCTIONS

function get_all_get_vars()
{
  // PURE
  $get_vars = [];
  foreach ($_GET as $key => $val) {
    $get_vars[$key] = $val;
  }
  // var_dump($get_vars);
  return $get_vars;
}

function check_is_any_other_prop_other_than_collection($get_vars)
{
  $is_any_other = false;
  foreach ($get_vars as $key => $value) {
    if ($key === 'collection') {
    } else {
      $is_any_other = true;
    }
  }
  return $is_any_other;
}

function check_is_any_other_prop_other_than_id_and_collection($get_vars)
{
  $is_any_other = false;
  foreach ($get_vars as $key => $value) {
    if ($key === 'collection' || $key === 'id') {
    } else {
      $is_any_other = true;
    }
  }
  return $is_any_other;
}

function filter_collection_by_get_vars($collection, $get_vars)
{
  if (is_array($collection)) {
    if (is_array($get_vars)) {
      // FILTERING
      $arr_filtered = [];
      foreach ($collection as $index => $row) {
        $include = true; // included is default
        foreach ($get_vars as $key => $val) {
          // if any of those not match will be excluded
          if ($key === 'collection') {
            // ignore var collection
          } else {
            if (isset($row[$key]) && $row[$key] == $val) {
              // do nothing
            } else {
              // EXCLUDE
              $include = false;
            }
          }
        }
        if ($include === true) {
          $arr_filtered[] = $row;
        }
      }
      return $arr_filtered; // filtered
    }
  }
  return $collection; // unchanged
}

function req_body_json_get()
{
  // Takes raw data from the request
  $req_body_raw_json = file_get_contents('php://input');
  // Converts it into a PHP object
  $req_body_decoded = json_decode($req_body_raw_json, true); // Adding the true returns the result as an array and not an stdClass.
  return $req_body_decoded;
}

function req_body_urlencoded_get()
{
  $req_body = null;
  $req_body_raw = file_get_contents('php://input');
  parse_str($req_body_raw, $req_body);
  // var_dump($req_body_raw);
  // var_dump($req_body);
  return $req_body;
}

function req_body_get()
{
  // https://www.ietf.org/rfc/rfc3875
  $req_body = []; // default empty array;
  if (isset($_SERVER["CONTENT_TYPE"])) {
    if ($_SERVER["CONTENT_TYPE"] === "application/json") {
      $req_body = req_body_json_get();
    }
    if ($_SERVER["CONTENT_TYPE"] === "application/x-www-form-urlencoded") {
      $req_body = req_body_urlencoded_get();
    }
  }
  if (isset($req_body) && is_array($req_body)) {
    return $req_body;
  }
  return []; // if not array return empty array
}
function write_new_db($db_data)
{
  global $db_file_path;
  $db_data_to_write = json_encode($db_data, JSON_PRETTY_PRINT);
  file_put_contents($db_file_path, $db_data_to_write);
  return true;
}

function compare_by_ids($a, $b)
{
  $a_ = $a;
  $b_ = $b;
  if (isset($a['id']) && isset($b['id'])) {
    $a_ = $a['id'];
    $b_ = $b['id'];
    if ($a_ < $b_) {
      return -1;
    }
    if ($a_ > $b_) {
      return 1;
    }
  }
  return 0;
}


// -----CONTROLLERS

function controler_get_where($collection, $get_vars)
{
  // GET ALL / GET WHERE
  global $db_data, $res_status, $res_data, $is_api_success_res, $is_api_error_not_found;
  $filtered_collection = filter_collection_by_get_vars($db_data[$collection], $get_vars);
  // STEP) PREPARE RES
  // $res_data = $db_data[$collection];
  $res_data = $filtered_collection; // return array
  $res_status = 200;
  $is_api_success_res = true;
  // EXIT CONTROLLER
  return;
}

function controler_get_single_by_id($collection, $id)
{
  // collection and id props. All other props will be ignored
  // GET SINGLE BY ID
  global $db_data, $res_status, $res_data, $is_api_success_res, $is_api_error_not_found;
  $get_vars_only_id = [];
  $get_vars_only_id['id'] = $id;
  $filtered_collection_by_id = filter_collection_by_get_vars($db_data[$collection], $get_vars_only_id);
  // STEP) PREPARE RES
  if (isset($filtered_collection_by_id[0])) {
    $res_data = $filtered_collection_by_id[0]; // return only first item as object
    $res_status = 200;
    $is_api_success_res = true;
    // EXIT CONTROLLER
    return;
  } else {
    // ERROR 404 Not Found
    $is_api_error_not_found = true;
    // EXIT CONTROLLER WITH ERROR
    return;
  }
}

function controler_post_create($collection)
{
  // POST CREATE
  global $db_data, $res_status, $res_data, $is_api_success_res, $is_api_error_not_found;
  // FIND LAST ID
  $new_id = 1;
  $latest_id = -1;
  // var_dump($db_data[$collection]);
  // foreach ($db_data[$collection] as $key => $val) {
  foreach ($db_data[$collection] as $index => $row) {
    if (isset($row['id']) && intval($row['id']) > 0) {
      // var_dump($row);
      // var_dump($row['id']);
      $id_int = intval($row['id']);
      if ($id_int > $latest_id) {
        $latest_id = $id_int;
      }
    }
  }
  if ($latest_id >= 0) {
    $new_id = $latest_id + 1;
  }
  // echo($latest_id);
  // STEP) use request BODY
  $req_body = req_body_get(); // body decoded
  // MUTATE
  if (is_array($req_body)) {
    $new_entity = [];
    foreach ($req_body as $key => $val) {
      $new_entity[$key] = $val;
    }
    $new_entity['id'] = $new_id; // NEW ID
    $db_data[$collection][] = $new_entity; // PUSH INTO ARRAY
    // STEP) FIX collection
    $db_data[$collection] = array_values($db_data[$collection]); // FIX FOR JSON ARRAY - array_values() removes the original keys and replaces with plain consecutive numbers
    // STEP) PREPARE RES
    $res_data = $new_entity;
    $res_status = 200;
    $is_api_success_res = true;
    // STEP) WRITE DB
    write_new_db($db_data);
    // EXIT CONTROLLER
    return;
  }
}

function controler_put_update_by_id($collection, $id)
{
  // PUT
  global $db_data, $res_status, $res_data, $is_api_success_res, $is_api_error_not_found;
  $is_found = false;
  foreach ($db_data[$collection] as $index => $row) {
    // var_dump($row);
    if (isset($row['id']) && $row['id'] == intval($id)) {
      // STEP) use request BODY
      $req_body = req_body_get(); // body decoded
      // var_dump($req_body);
      // MUTATE
      if (is_array($req_body)) {
        // PUT method (unlike tha PATCH) first delete all previous properties of entity
        unset($db_data[$collection][$index]); // Deleting a single array element
        // then add new properties
        $db_data[$collection][$index] = [];
        foreach ($req_body as $key => $val) {
          // var_dump($key);
          // $db_data[$collection][$index]['noviprop'] = 'Novost bla bla';
          $db_data[$collection][$index][$key] = $val;
        }
        $db_data[$collection][$index]['id'] = intval($id); // just in case
        // STEP) SORT and FIX collection
        usort($db_data[$collection], "compare_by_ids"); // sort collection by ids
        $db_data[$collection] = array_values($db_data[$collection]); // FIX FOR JSON ARRAY - array_values() removes the original keys and replaces with plain consecutive numbers
        // STEP) PREPARE RES
        $res_data = $db_data[$collection][$index];
        $res_status = 200;
        $is_api_success_res = true;
        // STEP) WRITE DB
        write_new_db($db_data);
        // EXIT CONTROLLER
        return;
      }
    }
  }
  if ($is_found === false) {
    // ERROR 404 Not Found
    $is_api_error_not_found = true;
    // EXIT CONTROLLER WITH ERROR
    return;
  }
}

function controler_patch_update_by_id($collection, $id)
{
  // PATCH
  global $db_data, $res_status, $res_data, $is_api_success_res, $is_api_error_not_found;
  $is_found = false;
  foreach ($db_data[$collection] as $index => $row) {
    // var_dump($row);
    if (isset($row['id']) && $row['id'] == intval($id)) {
      // STEP) use request BODY
      $req_body = req_body_get(); // body decoded
      // var_dump($req_body);
      // MUTATE PATCH UPDATE
      if (is_array($req_body)) {
        foreach ($req_body as $key => $val) {
          // var_dump($key);
          // $db_data[$collection][$index]['noviprop'] = 'Novost bla bla';
          $db_data[$collection][$index][$key] = $val;
        }
        $db_data[$collection][$index]['id'] = intval($id); // just in case
        // STEP) SORT and FIX collection
        usort($db_data[$collection], "compare_by_ids"); // sort collection by ids
        $db_data[$collection] = array_values($db_data[$collection]); // FIX FOR JSON ARRAY - array_values() removes the original keys and replaces with plain consecutive numbers
        // STEP) PREPARE RES
        $res_data = $db_data[$collection][$index];
        $res_status = 200;
        $is_api_success_res = true;
        // STEP) WRITE DB
        write_new_db($db_data);
        // EXIT CONTROLLER
        return;
      }
    }
  }
  if ($is_found === false) {
    // ERROR 404 Not Found
    $is_api_error_not_found = true;
    // EXIT CONTROLLER WITH ERROR
    return;
  }
}

function controler_delete_by_id($collection, $id)
{
  // The request is using the DELETE method
  global $db_data, $res_status, $res_data, $is_api_success_res, $is_api_error_not_found;
  // DELETE SINGLE
  $is_found = false;
  foreach ($db_data[$collection] as $index => $row) {
    if (isset($row['id']) && $row['id'] == intval($id)) {
      // MUTATE DELETE
      unset($db_data[$collection][$index]); // Deleting a single array element
      // STEP) SORT and FIX collection
      usort($db_data[$collection], "compare_by_ids"); // sort collection by ids
      $db_data[$collection] = array_values($db_data[$collection]); // FIX FOR JSON ARRAY - array_values() removes the original keys and replaces with plain consecutive numbers
      // STEP) PREPARE RES
      $res_data = null; // empty json object
      $res_status = 200;
      $is_api_success_res = true;
      // STEP) WRITE DB
      write_new_db($db_data);
      // EXIT CONTROLLER
      return;
    }
  }
  if ($is_found === false) {
    // ERROR 404 Not Found
    $is_api_error_not_found = true;
    // EXIT CONTROLLER WITH ERROR
    return;
  }
}


// -----ROUTER
function router()
{
  // UNIVERSAL ROUTER PROCEDURE
  global $db_data, $route_is_api, $res_status, $res_type_is_json, $res_data, $is_api_success_res, $is_api_error_not_found, $is_error_other;

  $res_status = 500;
  $is_mutating = false; // is mutating
  $collection = null; // table name
  $id = null; //

  if (isset($_GET['collection'])) {
    // table name
    $collection = $_GET['collection'];
  }
  if (isset($_GET['id'])) {
    $id = $_GET['id'];
  }

  if (isset($collection)) {
    // API JSON
    $route_is_api = true; // true is API
    $res_type_is_json = true;
    $res_status = 500;
    $is_api_success_res = false;
    // >> CONTINUE ROUTING PROCEDURE
  } else {
    // - When "collection" url query variable is not provided, than return HTML.
    // HTML
    $route_is_api = false; // false is HTML
    $res_type_is_json = false;
    // EXIT ROUTER
    return;
  }

  if (is_array($db_data)) {
    // db valid
    if (isset($collection) && isset($db_data[$collection]) && is_array($db_data[$collection])) {
      // collection array exist
    } else {
      // - When "collection" url query variable is provided but colection not exist in database, than return 404 Not Found.
      // ERROR 404 Not Found
      $res_status = 404;
      $res_data = null; // empty json object
      $is_api_success_res = false;
      $is_api_error_not_found = true;
      // EXIT ROUTER WITH ERROR
      return;
    }
  } else {
    // db not valid
    $res_status = 500;
    $is_api_success_res = false;
    $res_data = null; // empty json object
    $is_error_other = true;
    // EXIT ROUTER WITH ERROR
    return;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // The request is using the GET method
    // controllers for GET ALL / GET WHERE / GET SINGLE BY ID
    $get_vars = get_all_get_vars();
    if (check_is_any_other_prop_other_than_collection($get_vars)) {
      if (isset($get_vars['id'])) {
        // collection and id props. All other props will be ignored
        controler_get_single_by_id($collection, $id);
      } else {
        // GET WHERE
        controler_get_where($collection, $get_vars);
      }
    } else {
      // only collection prop
      // GET ALl
      controler_get_where($collection, []);
    }
    return; // EXIT ROUTER
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // The request is using the POST method
    if (isset($id)) {
      // - POST method must not have "id" or return 404 Not Found.
      // ERROR 404 Not Found
      $is_api_error_not_found = true;
      // EXIT ROUTER WITH ERROR
      return;
    } else {
      $is_mutating = true;
      controler_post_create($collection);
      return; // EXIT ROUTER
    }
  }

  // ALL METHOD EXCEPT GET and POST
  if (isset($id)) {
    // id var exist
  } else {
    // - PUT PATCH and DELETE methods require "id" or return 404 Not Found.
    // ERROR 404 Not Found
    $res_status = 404;
    $res_data = null; // empty json object
    $is_api_success_res = false;
    $is_api_error_not_found = true;
    // EXIT ROUTER WITH ERROR
    return;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // The request is using the PUT method
    $is_mutating = true;
    controler_put_update_by_id($collection, $id);
    return; // EXIT ROUTER
  }
  if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    // The request is using the PATCH method
    $is_mutating = true;
    controler_patch_update_by_id($collection, $id);
    return; // EXIT ROUTER
  }
  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // The request is using the DELETE method
    $is_mutating = true;
    controler_delete_by_id($collection, $id);
    return; // EXIT ROUTER
  }
  // end of router
}


// -----RESPONSE AND OUTPUT

function response_send_as_json($json, $res_status)
{
  // return json data to frontend
  header('Content-Type: application/json');
  http_response_code($res_status);
  echo $json;
  exit;
}

function api_response_send($res_data, $res_status)
{
  $json = json_encode($res_data, JSON_PRETTY_PRINT); // JSON
  response_send_as_json($json, $res_status);
}

function api_response_send_json_empty_object($res_status)
{
  $json_empty_object = '{}'; // empty json object
  response_send_as_json($json_empty_object, $res_status);
}

function response_finish($route_is_api, $res_status, $res_type_is_json, $res_data, $is_api_success_res, $is_api_error_not_found, $is_error_other)
{
  if ($route_is_api === true) {
    if ($is_api_error_not_found === true) {
      // ERROR 404 Not Found
      $res_status = 404;
      $is_api_success_res = false;
      $res_data = null; // empty json object
      api_response_send_json_empty_object(404);
      exit; // STOP EXECUTION OF THIS PAGE AFTER RENDERING JSON
    }
    if ($is_error_other === true) {
      // ERROR 500
      $res_status = 500;
      $is_api_success_res = false;
      $res_data = null; // empty json object
      api_response_send_json_empty_object(500);
      exit; // STOP EXECUTION OF THIS PAGE AFTER RENDERING JSON
    }
    if ($is_api_success_res === true) {
      if ($res_data === null) {
        api_response_send_json_empty_object($res_status); // 200
      } else {
        api_response_send($res_data, $res_status);
      }
    } else {
      api_response_send_json_empty_object($res_status); // ???
    }
    exit; // STOP EXECUTION OF THIS PAGE AFTER RENDERING JSON
  }
  // else response will be HTML after php in this file...
}


// -----EXECUTE skript
router();
response_finish($route_is_api, $res_status, $res_type_is_json, $res_data, $is_api_success_res, $is_api_error_not_found, $is_error_other);


// END OF PHP. If there is no exit command before, output will be HTML code from the end of this document.
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
  <title>json-server-php.php</title>
  <meta name="description" content="json-server-php.php" />
  <meta name="author" content="Zarko Turicanin">
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0px;
      padding: 30px;
      padding-bottom: 60px;
      font-family: 'Open Sans', sans-serif;
      line-height: 1.4;
      font-size: 16px;
    }

    h1 {
      margin-top: 0;
    }

    h2 {
      margin: 0.5em 0;
      margin-bottom: 0.25em;
    }

    p {
      margin: 0.6em 0;
      margin-bottom: 0.1em;
    }

    pre {
      margin: 0;
      margin-bottom: 0.2em;
    }
  </style>
</head>

<body>
  <div>
    <h1>json-server-php.php v0.3.9</h1>
    <p>Simple server for basic API CRUD operations that use single json file as database. Inspired by Node.js <a target="_blank" href="https://www.npmjs.com/package/json-server">json-server</a></p>
    <p>Currently working http request methods: GET POST PUT PATCH DELETE</p>
    <h2>How to install</h2>
    <p>On your hosting, put your json in file /db/db.json and get following structure in your folder:</p>
    <pre><code>db/db.json
.htaccess
json-server-php.php</code></pre>
    <p>You can move that structure to any folder you want but path will change. For example, if you move all that into "api" folder than every route will begin with "/api".</p>
    <h2>How to use</h2>
    <p>Basic functionality almost the same as <a target="_blank" href="https://www.npmjs.com/package/json-server">json-server</a></p>
    <p><b>Request body (for POST PUT and PATCH)</b></p>
    <p>Currently only supported is:</p>
    <pre><code>Content-Type: application/json</code></pre>
    <p>or</p>
    <pre><code>Content-Type: application/x-www-form-urlencoded</code></pre>
    <p><b>Routes are:</b></p>
    <pre><code>GET     /posts
GET     /posts/4
POST    /posts
PUT     /posts/4
PATCH   /posts/4
DELETE  /posts/4</code></pre>
    <p><b>GET all items from collection</b></p>
    <pre><code>GET     /posts      or      /json-server-php.php?collection=posts</code></pre>
    <p><b>GET items from collection where</b></p>
    <pre><code>GET     /posts      or      /json-server-php.php?collection=posts?user_id=2</code></pre>
    <p><b>GET single item by id</b></p>
    <pre><code>GET     /posts/4    or      /json-server-php.php?collection=posts&id=4</code></pre>
    <p><b>POST create</b></p>
    <pre><code>POST    /posts      or      /json-server-php.php?collection=posts</code></pre>
    <p><b>PUT update (replace entire entity) single item by id</b></p>
    <pre><code>PUT     /posts/4    or      /json-server-php.php?collection=posts&id=4</code></pre>
    <p><b>PATCH update (partially update entity - replace only fields that you give) single item by id</b></p>
    <pre><code>PATCH   /posts/4    or      /json-server-php.php?collection=posts&id=4</code></pre>
    <p><b>DELETE single item by id</b></p>
    <pre><code>DELETE  /posts/4    or      /json-server-php.php?collection=posts&id=4</code></pre>
  </div>
</body>

</html>