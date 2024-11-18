import React from 'react';
import { AuthProvider as OidcProvider } from 'react-oidc-context';
import { oidcConfig } from '../config/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <OidcProvider {...oidcConfig}>
      {children}
    </OidcProvider>
  );
};

export default AuthProvider; 