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
  return (<>
    <AuthLayout
      title="Sign up"
      description={
        <>
          <Typography
            color="text.secondary"
            align="right"
            display="block"
            component="span"
            sx={{ mt: -4.25, mb: 2, alignSelf: "flex-end" }}
          >
            or{" "}
            <MuiLink component={Link} to="" color="text.secondary">
              sign in
            </MuiLink>
          </Typography>
          Welcome! To join this project, sign up with the email address
          {searchParams.get("email") ? (
            <>
              : <b style={{ userSelect: "all" }}>{searchParams.get("email")}</b>
            </>
          ) : (
            " used to invite you."
          )}
        </>
      }
    >
      <div>Welcome</div>
    </AuthLayout>
  </>);
};
