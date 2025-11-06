import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Typography, Link as MuiLink } from "@mui/material";
import AuthLayout from "@src/modules/ui/layouts/AuthLayout";
import { useVerifyLoginToken } from '@src/modules/auth/hooks/useVerifyLoginToken';

export default function VerifyLoginTokenEffect() {
  const [searchParams] = useSearchParams();
  const loginToken = searchParams.get('loginToken');
  const { verifyLoginToken } = useVerifyLoginToken();

  useEffect(() => {
    if (loginToken) {
      verifyLoginToken(loginToken);
    }
  }, []);
  return (<></>);
};
