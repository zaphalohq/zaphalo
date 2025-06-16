import { useParams, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@src/modules/auth/hooks/useAuth';

export const useVerifyLoginToken = () => {
  const navigate = useNavigate();
  const { getAuthTokensFromLoginToken } = useAuth();

  const verifyLoginToken = async (loginToken: string) => {
    try {
      const token = await getAuthTokensFromLoginToken(loginToken);
      console.log(token,".................................token......token");
      
    } catch (error) {
      navigate('/login'+error);
    }
  };

  return { verifyLoginToken };
};

