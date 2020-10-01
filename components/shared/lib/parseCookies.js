import cookie from "cookie";

export function parseCookies(req){
    return cookie.parse(req ? req.header.cookie || "" : document.cookie);
}