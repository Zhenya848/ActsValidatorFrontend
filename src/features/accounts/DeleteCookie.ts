export const DeleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
};