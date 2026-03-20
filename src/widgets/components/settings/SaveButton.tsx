import { CheckCircle2 } from "lucide-react";
import { Button } from "../../../shared/ui/button";

interface ISaveButtonParameters {
  label?: string,
  saved: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  disabled: boolean
}

export function SaveButton({ label = 'Сохранить', saved, onClick, disabled = false }: ISaveButtonParameters) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`mt-4 h-10 rounded-xl text-sm px-5 transition-all ${
        saved ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {saved ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Сохранено
        </>
      ) : label}
    </Button>
  );
}