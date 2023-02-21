# UPUSTVO ZA json-server-php za social-app

## Na hostingu
- Na hostingu tamo gde se stave fajlovi od React build-a tu kopirati ceo folder api
/api


Ako se vec nalazi tamo prilikom postavljanja novog builda fodler api ne treba dirati uopste. Znači staviti novi build pored api fodlera i ne brisati ga.


## U React aplikaciji mora sledece
- (URADJENO) Razlika je sto json-server-php ne radi na posebnom portu 3033 nego na istom portu gde je i sama aplikacija.
i onda da bi se znalo kad se obracamo backendu backend json-server-php sto stavili u fodler /api
i onda svaki URL koji je namenjen za api mora da pocinje sa /api

Na primer:
sto je na json-server bilo localhost:3033/posts/1
to ja na json-server-php /api/posts/1


## U kom okruzenju php fajl radi?
- ako se php fajl postavi na socialapp.bojangolic.com u folder /api on ce da radi na adresi https://socialapp.bojangolic.com/api jer je na hostgator kao i drugim shared hostinzima phpo vec instaliran i pokrenut.

- ako se React apliakcija startuje lokalno sa localhost:3000 ona isto mora da pristupa backendu na internetu na https://socialapp.bojangolic.com/api

- php moze da se startuje i lokalno na windowsu pomocu XAMPP https://www.apachefriends.org/ php servera.



