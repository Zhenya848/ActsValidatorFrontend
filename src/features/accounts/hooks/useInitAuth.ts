import { useGetUserQuery } from "../api";
import { GetCookies } from "../GetCookies";
import { setCredentials } from "../../../app/auth.slice";
import { useAppDispatch } from "../../../app/store";
import { useEffect } from "react";

export const useInitAuth = () => {
    const isRefreshToken = GetCookies("refreshToken");
    const dispatch = useAppDispatch();

    const { data: userData, isLoading, isError, isSuccess } = useGetUserQuery(undefined, {
        skip: !isRefreshToken
    });

    useEffect(() => {
        if (isSuccess && userData) {
            dispatch(setCredentials({ user: userData.result! }));
        }
    }, [isSuccess, userData, dispatch]);

    return {
        isLoading,
        isError,
        isSuccess
    };
}