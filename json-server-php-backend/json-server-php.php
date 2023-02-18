<?php
// START script
$this_script_name_version = 'json-server-php.php v0.1 2023-02-16 beta...';
/*
json-server-php.php v0.3.4
SOLUTION PROFILE: zt_php_2023_rev1
*/


// -----CONFIG
$config_db_file_path = "db/db.json"; // path relative to this file;


// -----GLOBAL VARS
$something = "Hello";
$is_mutating = false; // is mutating
$is_api_req = false; //

// res
$res_status = null;
$res_type_is_json = false;
$res_data = []; // default is array to be easier later to add some items in it.

// response cases
$is_success_api_res = false; // same as res_status 200 OK
$is_error_not_found = false; // ERROR 404 Not Found
$is_error_other = false; // ERROR 500


// -----FILES...

// $data = json_decode(file_get_contents('fajl.json'), true);

$fs_path = $_SERVER['SCRIPT_FILENAME'];
$fs_directory = dirname($fs_path) . "/"; // The best // file system folder
$db_file_path = $fs_directory . $config_db_file_path; // $fs_directory  vec sadrzi kosu crtu na kraju... ??? TODO mozda nije najbolje resenje

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
  if ($_SERVER["CONTENT_TYPE"] === "application/json") {
    $req_body = req_body_json_get();
  }
  if ($_SERVER["CONTENT_TYPE"] === "application/x-www-form-urlencoded") {
    $req_body = req_body_urlencoded_get();
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


// -----UNIVERSAL CONTROLLER PROCEDURE

function controller()
{
  // UNIVERSAL CONTROLLER
  // global $collection, $db_data, $is_api_req, $res_type_is_json, $res_status, $is_success_api_res;
  global $db_data, $is_api_req, $res_status, $res_type_is_json, $res_data, $is_success_api_res, $is_error_not_found, $is_error_other, $is_mutating;

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
    $is_api_req = true;
    $res_type_is_json = true;
    $res_status = 500;
    $is_success_api_res = false;
  } else {
    // - When "collection" url query variable is not provided, than return HTML.
    // HTML
    $is_api_req = false;
    $res_type_is_json = false;
    // EXIT COMTROLLER
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
      $is_success_api_res = false;
      $is_error_not_found = true;
      // EXIT CONTROLLER WITH ERROR
      return;
    }
  } else {
    // db not valid
    $res_status = 500;
    $is_success_api_res = false;
    $res_data = null; // empty json object
    $is_error_other = true;
    // EXIT CONTROLLER WITH ERROR
    return;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // The request is using the GET method
    if ($is_api_req === true) {
      $get_vars = get_all_get_vars();
      if (check_is_any_other_prop_other_than_collection($get_vars)) {
        if (isset($get_vars['id'])) {
          // collection and id props. All other props will be ignored
          // GET SINGLE BY ID
          $get_vars_only_id = [];
          $get_vars_only_id['id'] = $id;
          $filtered_collection_by_id = filter_collection_by_get_vars($db_data[$collection], $get_vars_only_id);
          // STEP) PREPARE RES
          if (isset($filtered_collection_by_id[0])) {
            $res_data = $filtered_collection_by_id[0]; // return only first item as object
            $res_status = 200;
            $is_success_api_res = true;
            // EXIT CONTROLLER
            return;
          } else {
            // ERROR 404 Not Found
            $is_error_not_found = true;
            // EXIT CONTROLLER WITH ERROR
            return;
          }
        } else {
          // GET WHERE
          $filtered_collection = filter_collection_by_get_vars($db_data[$collection], $get_vars);
          // STEP) PREPARE RES
          $res_data = $filtered_collection; // return array
          $res_status = 200;
          $is_success_api_res = true;
          // EXIT CONTROLLER
          return;
        }
      } else {
        // only collection prop
        // GET ALl
        $filtered_collection = filter_collection_by_get_vars($db_data[$collection], $get_vars);
        // STEP) PREPARE RES
        // $res_data = $db_data[$collection];
        $res_data = $filtered_collection; // return array
        $res_status = 200;
        $is_success_api_res = true;
        // EXIT CONTROLLER
        return;
      }
    }
  } else {
    // mutating methods POST PUT PATCH DELETE
    $is_mutating = true; // ???

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      // The request is using the POST method
      if ($is_api_req === true) {
        if (isset($id)) {
          // - POST method must not have "id" or return 404 Not Found.
          // ERROR 404 Not Found
          $is_error_not_found = true;
          // EXIT CONTROLLER WITH ERROR
          return;
        } else {
          // POST CREATE
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
            $is_success_api_res = true;
            // STEP) WRITE DB
            write_new_db($db_data);
            // EXIT CONTROLLER
            return;
          }
        }
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
      $is_success_api_res = false;
      $is_error_not_found = true;
      // EXIT CONTROLLER WITH ERROR
      return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
      // The request is using the PUT method
      // if (isset($collection) && isset($id) && isset($db_data) && isset($db_data[$collection])) {
      if ($is_api_req === true) {
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
              $is_success_api_res = true;
              // STEP) WRITE DB
              write_new_db($db_data);
              // EXIT CONTROLLER
              return;
            }
          }
        }
        if ($is_found === false) {
          // ERROR 404 Not Found
          $is_error_not_found = true;
          // EXIT CONTROLLER WITH ERROR
          return;
        }
      }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
      // The request is using the PATCH method
      // if (isset($collection) && isset($id) && isset($db_data) && isset($db_data[$collection])) {
      if ($is_api_req === true) {
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
              $is_success_api_res = true;
              // STEP) WRITE DB
              write_new_db($db_data);
              // EXIT CONTROLLER
              return;
            }
          }
        }
        if ($is_found === false) {
          // ERROR 404 Not Found
          $is_error_not_found = true;
          // EXIT CONTROLLER WITH ERROR
          return;
        }
      }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
      // The request is using the DELETE method
      if ($is_api_req === true) {
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
            // $res_data = true;
            $res_data = null;
            $res_status = 200;
            $is_success_api_res = true;
            // STEP) WRITE DB
            write_new_db($db_data);
            // EXIT CONTROLLER
            return;
          }
        }
        if ($is_found === false) {
          // ERROR 404 Not Found
          $is_error_not_found = true;
          // EXIT CONTROLLER WITH ERROR
          return;
        }
      }
    }

  }
  // CONTROLLER END
  return;
}


// -----RESPONSE

function response_send_json($res_data, $res_status)
{
  // return json data to frontend
  $json = json_encode($res_data, JSON_PRETTY_PRINT); // JSON
  header('Content-Type: application/json');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");
  http_response_code($res_status);
  echo $json;
  exit;
}

function response_send_json_empty_object($res_status)
{
  // return json data to frontend
  $json = '{}'; // JSON empty object
  header('Content-Type: application/json');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");
  http_response_code($res_status);
  echo $json;
  exit;
}

function response_finish($res_status, $res_type_is_json, $res_data, $is_success_api_res, $is_error_not_found, $is_error_other)
{
  if ($is_error_not_found === true) {
    // ERROR 404 Not Found
    $res_status = 404;
    $is_success_api_res = false;
    $res_data = null; // empty json object
    response_send_json_empty_object(404);
    exit; // STOP EXECUTION OF THIS PAGE AFTER RENDERING JSON
  }
  if ($is_error_other === true) {
    // ERROR 404 Not Found
    $res_status = 500;
    $is_success_api_res = false;
    $res_data = null; // empty json object
    response_send_json_empty_object(500);
    exit; // STOP EXECUTION OF THIS PAGE AFTER RENDERING JSON
  }
  if ($res_type_is_json === true) {
    if ($is_success_api_res === true) {
      if ($res_data === null) {
        response_send_json_empty_object($res_status); // 200
      }
      response_send_json($res_data, $res_status);
    } else {
      response_send_json_empty_object($res_status); // ???
    }
    exit; // STOP EXECUTION OF THIS PAGE AFTER RENDERING JSON
  }

  // else response will be HTML after php in this file...
}


// -----EXECUTE skript
controller();
response_finish($res_status, $res_type_is_json, $res_data, $is_success_api_res, $is_error_not_found, $is_error_other);


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
    <h1>json-server-php.php v0.3.4</h1>
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