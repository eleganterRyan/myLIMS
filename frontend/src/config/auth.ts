export const oidcConfig = {
  authority: 'http://localhost:8080/realms/lims',  // Keycloak 服务器地址
  client_id: 'lims-client',                        // 客户端 ID
  redirect_uri: 'http://localhost:3000/callback',  // 回调地址
  response_type: 'code',
  scope: 'openid profile email',
  post_logout_redirect_uri: 'http://localhost:3000',
}; 