import { useSelector } from "react-redux";
import { useSayHelloQuery } from "../api";
import { GetCookies } from "../GetCookies";
import { selectUser } from "../../../app/auth.slice";

export const useInitAuth = () => {
    const isRefreshToken = GetCookies("refreshToken");
    const user = useSelector(selectUser);

    const { isLoading, isError, isSuccess } = useSayHelloQuery(undefined, {
        skip: !isRefreshToken || user != null,
    });

    return {
        isLoading,
        isError,
        isSuccess
    };
}