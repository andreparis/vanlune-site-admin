import Cookie from "js-cookie";
import {keysToLowerCase} from '../Util/util';
import jwt_decode from "jwt-decode";

export const TOKEN_KEY = "player2.back.authToken";
export const USER_KEY = "player2.back.userInfo";

export const decodedToken = () => {
    let cookieToken = Cookie.get(TOKEN_KEY);
    if (cookieToken)
      return jwt_decode(cookieToken);

    return {exp: 0};
};

export const expiresAt = () => {
    let decoded = decodedToken();

    return new Date(decoded.exp * 1000);
}
export const isExpired = () => {
    let date = new Date();
    return date > expiresAt();
}

export const isValid = (role) => {
    console.log(role);
    let decoded = decodedToken();
    console.log(decoded);

    return !isExpired();
}

export const getToken = () => {
    let user = getUser();
    let cookieToken = Cookie.get(TOKEN_KEY);

    return cookieToken + user['id'];
};

export const getUser = () => {
    let user = Cookie.get(USER_KEY);
    if (!user)
        return {id: 0};
    let obj = JSON.parse(user);
    return obj;
};

export const login =  (token, user) => {
    user = keysToLowerCase(user);
    Cookie.set(TOKEN_KEY, token);
    Cookie.set(USER_KEY, JSON.stringify(user));

};
export const logout = () => {
    Cookie.remove(TOKEN_KEY);
    Cookie.remove(USER_KEY);
};
