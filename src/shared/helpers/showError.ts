import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import type { Envelope } from "../api/Envelope";

export function showError(error: unknown) {
    const rtkError = error as FetchBaseQueryError | SerializedError | undefined;
    console.error(rtkError);

    getErrorMessages(rtkError).map(error => {
        toast.error(error);
    });
}

function getErrorMessages(error: FetchBaseQueryError | SerializedError | undefined): string[] {
    if (error) {
        if ("status" in error) {
            const errorData = error.data as Envelope<null> | undefined;

            if (errorData && errorData.responseErrors) {
                return errorData.responseErrors.map(error => {
                    return ErrorMessages[error.code] || error.message || "Неизвестная ошибка";
                });
            }

            return ["Серверная ошибка"];
        }

        return ["Непредвиденная ошибка"];
    }

    return [];
}

const ErrorMessages: Record<string, string> = {
    "value.is.invalid": "Ожидаются значения",
    "record.not.found": "Объект не найден",
    "failure": "Что - то пошло не так",
    "value.is.required": "Ожидаются значения",
    "user.already.exist": "Такой пользователь уже существует",
    "DuplicateUserName": "Пользователь с таким именем уже существует",
    "user.notfound": "Пользователь не найден",
    "user.wrong.credentials": "Неверные пользовательские данные",
    "server.internal": "Ошибка на стороне сервера",
    "find.chat.failure": "Не удалось найти telegram чат"
}