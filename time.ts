export function now(): number {
	return new Date().valueOf();
}

export function time(): number { // this is php-like for the database
	return Math.round( now() / 1000 );
}
