import { useErrorBoundary, FallbackProps } from "react-error-boundary";

type AppRootErrorFallbackProps = FallbackProps & {
  title?: string;
};

export const AppErrorFallback = ({
  error,
  resetErrorBoundary,
  title = 'Sorry, something went wrong',
}: AppRootErrorFallbackProps) => {
  // const { resetBoundary } = useErrorBoundary();

  return (
    <div class="grid justify-center items-center" role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}