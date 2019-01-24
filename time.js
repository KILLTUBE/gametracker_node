function now() {
	return new Date().valueOf();
}

function time() { // this is php-like for the database
	return parseInt(now()/1000);
}