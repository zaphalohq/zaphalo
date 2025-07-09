
import { FallbackProps } from "react-error-boundary";

type AppRootErrorFallbackProps = FallbackProps & {
  title?: string;
};

export const AppErrorFullScreen = ({
 	error,
  resetErrorBoundary,
  title = 'Sorry, something went wrong',
}) => {

	return (
		<div className="grid justify-center items-center" role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
	)
};