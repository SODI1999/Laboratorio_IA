import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorAlertProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({
  title = "Error de comunicación con el servidor",
  message = "No fue posible conectar con el backend de BodegaCore en http://localhost:8080. Verifique que el servicio Spring Boot esté en ejecución.",
  onRetry,
  className = "",
}: ErrorAlertProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-xl border border-rose-200 bg-rose-50/70 p-5 text-rose-900 shadow-xs ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-rose-900 mb-1">{title}</h4>
          <p className="text-xs text-rose-700 leading-relaxed mb-3">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="border-rose-300 bg-white text-rose-700 hover:bg-rose-100/50 hover:text-rose-900 text-xs h-8 space-x-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reintentar conexión</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
