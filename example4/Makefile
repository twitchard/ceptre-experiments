install:
	npm install
	( cd client && npm install )

watch-client:
	(cd client && node_modules/.bin/parcel watch -d dist index.html)

watch-server:
	node_modules/.bin/nodemon server.js
