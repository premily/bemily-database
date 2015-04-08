# bemily-database


## CouchDB views

### 'user/user'
```javascript
function(doc) {
 if(doc.type == 'user') {
   emit('user', {
	_id: doc._id,
	_rev: doc._rev,
	picture: doc.picture,
	name: doc.name, 
	surname: doc.surname,
	mail: doc.mail,
	major: doc.major,
	semester: doc.semester,
	subscribed_groups: doc.subscribed_groups,
	password: doc.password, _id: doc._id
	});
 }
}
```

## Tests

Tests can be run with `npm test` or `make test`, `make test-cov` and `test-cov-html`.
Note:  `npm test` points to `make test-cov`. This is inspired from many hapi plugins.
