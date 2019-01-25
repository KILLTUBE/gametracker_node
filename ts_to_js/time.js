export function now() {
    return new Date().valueOf();
}
export function time() {
    return Math.round(now() / 1000);
}
