# README json-server-php v0.3.9

## INSPIRATION

https://www.npmjs.com/package/json-server

https://github.com/typicode/json-server


## .htaccess problmatika


GET    /posts
GET    /posts/4
POST   /posts
PUT    /posts/4
PATCH  /posts/4
DELETE /posts/4

<p><b>GET</b> /json-server-php.php?collection=posts</p>
<p><b>GET</b> /json-server-php.php?collection=posts&id=4</p>
<p><b>POST</b> /json-server-php.php?collection=posts</p>
<p><b>PUT</b> /json-server-php.php?collection=posts&id=4</p>
<p><b>PATCH</b> /json-server-php.php?collection=posts&id=4</p>
<p><b>DELETE</b> /json-server-php.php?collection=posts&id=4</p>


###

RewriteEngine On
RewriteRule ^posts/?$ json-server-php.php?collection=posts [L,QSA]
RewriteRule ^posts/([0-9]+?)/?$ json-server-php.php?collection=posts&id=$1 [L,QSA]

DirectoryIndex json-server-php.php


###

RewriteEngine On
RewriteRule ^(posts|users|bla)/?$ json-server-php.php?collection=$1 [L,QSA]
RewriteRule ^(posts|users|bla)/([0-9]+?)/?$ json-server-php.php?collection=$1&id=$2 [L,QSA]

DirectoryIndex json-server-php.php


Popuni sve moguće vrednosti unutar te prve zagrade po istom principu.


###

Ako hoćeš da baš SVAKU REČ šalje php-u, ako ne postoji kao fajl ili folder:


RewriteEngine On

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([a-z0-9\-]+?)/?$ json-server-php.php?collection=$1 [L,QSA]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([a-z0-9\-]+?)/([0-9]+?)/?$ json-server-php.php?collection=$1&id=$2 [L,QSA]

DirectoryIndex json-server-php.php


###



## REPLICATED FEATURES OF json-server

### Every method
- When "collection" url query variable is provided but colection with that name not exist in database, than return 404 Not Found.
- When there is no json or urlencoded variables in request, same result as there is empty json object.

### GET method
- When no other url query variable other than "collection" is provided than return Array with all items from collection. Array can be empty.
- When there is other url query variable next to "collection" but no "id" than return Array with items where those key=value conditions are meet. Array can be empty.
- Empty array is also with status 200 OK.
- When there is "id" next to "collection", other url query variables are ignored, than return 200 single entity object or 404 Not Found.

### PUT PATCH and DELETE are "by id" methods
- PUT PATCH and DELETE methods require "id" or return 404 Not Found. No entity can be updated/deleted without "id".
- Any other url query variable except "collection" and "id" are ignored.
- When "id" url query variable is provided but item with that "id" not exist in that collection, than return 404 Not Found.

### PUT method
- When there is no request body variables (or not even empty json object) entity will be changed in a way that only "id" property will stay in entity object.
- When PUT (or PATCH) is successful return Status 200 OK and updated entity object with header "Content-Type: json".

### PATCH method
- When there is no request body variables (or not even empty json object) will be succes but entity will not change.
- When PATCH (or PUT) is successful return Status 200 OK and updated entity object with header "Content-Type: json".

### DELETE method
- When DELETE is successful return Status 200 OK and content "{}" (empty json object) with header "Content-Type: json".

### POST method
- POST method must not have "id" or return 404 Not Found.
- Any other url query variable except "collection" and "id" are ignored.
- When there is no request body variables (or not even empty json object) than create new entity with only "id" property.
- When POST is successful return Status 200 OK new entity object with header "Content-Type: json".

### 404 Not Found Error
- When some method return Status 404 Not Found, than also return content "{}" (empty json object) with header "Content-Type: json".

### Request contenty type
- Currently supported is 'Content-Type: application/json' or 'Content-Type: application/x-www-form-urlencoded'.


## FEATURES THAT MAY NOT BE REPLICA OF json-server

### Every method
- "id" must be integer and greater than zero or unexpected results may occur. Most likely if you try non integer id you will get erroe 404 Not Found because that id not exist.
- When "collection" url query variable is not provided, than return HTML.
- Response content type is always JSON except when no collection is provided and returning HTML.

## chamgelog
- Fixed bug in .htaccess when id is not integer
- Allowed characters in .htaccess is now: a-z A-Z 0-9 _ -


## TODO
- TODO: Singular routes???
- ako je poslat urlencoded sa praznim key value on u entity upise prazan key i prazan value: "": "" kao u json-server.
