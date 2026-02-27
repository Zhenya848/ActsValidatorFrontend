export const GetCookies = (name: string): string | undefined => {
    const allCookies = document.cookie.split("; ");
    
    for (let i = 0; i < allCookies.length; i++) {
        const cookiePeaces = allCookies[i].split("=");

        if (cookiePeaces.length < 2)
            continue;

        if (cookiePeaces[0].toLocaleLowerCase() == name.toLocaleLowerCase())
            return cookiePeaces[1];
    }
}