import { useParams, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@src/modules/auth/hooks/useAuth';

export const useVerifyLoginToken = () => {
  const navigate = useNavigate();
  const { getAuthTokensFromLoginToken } = useAuth();

  const verifyLoginToken = async (loginToken: string) => {
    try {
      await getAuthTokensFromLoginToken(loginToken);
    } catch (error) {
      navigate('/login');
    }
  };

  return { verifyLoginToken };
};

