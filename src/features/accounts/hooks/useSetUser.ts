import { selectUser, setCredentials } from "../../../app/auth.slice";
import { useAppDispatch } from "../../../app/store";
import { useRefreshMutation } from "../../../features/accounts/api";
import { showError } from "../../../shared/helpers/showError";
import { GetCookies } from "../GetCookies";
import { useSelector } from "react-redux";

export const useSetUser = () => {
    const dispatch = useAppDispatch();
    const [refresh, {isLoading}] = useRefreshMutation();
    const user = useSelector(selectUser);

    const setUser = async () => {
        if (user) {
            return;
        }

        const refreshTokenResult = GetCookies("refreshToken");

        if (refreshTokenResult) {

            try {
                const refreshResult = await refresh().unwrap();

                if (!refreshResult)
                    return;

                dispatch(setCredentials({ accessToken: refreshResult.result!.accessToken, user: refreshResult.result!.user }))
            }
            catch (error: unknown) {
                showError(error);
            }
        }
    }

    return {
        setUser,
        isLoading
    }
}