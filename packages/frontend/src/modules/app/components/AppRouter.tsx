import { RouterProvider } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { router } from 'src/modules/app/hooks/createAppRouter';


export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
