import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../../app/auth.slice";
import { useAppDispatch } from "../../../app/store";
import { showError } from "../../../shared/helpers/showError";
import { useLoginMutation, useRegisterMutation } from "../api";

interface IRegistrerParameters {
    email: string,
    userName: string,
    password: string
}

export const useRegistration = () => {
  const [register, { isLoading: isRegisterLoading, isError: isRegisterError, isSuccess: isRegisterSuccess }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading, isError: isLoginError, isSuccess: isLoginSuccess }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (registerRequest: IRegistrerParameters) => {
    try {
        await register({ userName: registerRequest.userName, email: registerRequest.email, password: registerRequest.password}).unwrap();

        const loginResponse = await login({ email: registerRequest.email, password: registerRequest.password }).unwrap();
        dispatch(setCredentials({ accessToken: loginResponse.result!.accessToken, user: loginResponse.result!.user }));
        
        navigate("/");
    } 
    catch (e: unknown) {
        showError(e);
    }
  };

  return {
    handleRegister,
    isLoading: isRegisterLoading || isLoginLoading,
    isError: isRegisterError || isLoginError,
    isSuccess: isRegisterSuccess && isLoginSuccess
  };
};