import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../../app/auth.slice";
import { useAppDispatch } from "../../../app/store";
import { showError } from "../../../shared/helpers/showError";
import { useLoginMutation } from "../api";

interface ILoginParameters {
    email: string,
    password: string
}

export const useLogin = () => {
  const [login, { isLoading, isError, isSuccess }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (loginRequest: ILoginParameters) => {
    try {
        const loginResponse = await login({ email: loginRequest.email, password: loginRequest.password }).unwrap();
        dispatch(setCredentials({ accessToken: loginResponse.result!.accessToken, user: loginResponse.result!.user }));
        
        navigate("/");
    } 
    catch (e: unknown) {
        showError(e);
    }
  };

  return {
    handleLogin,
    isLoading: isLoading,
    isError: isError,
    isSuccess: isSuccess
  };
};