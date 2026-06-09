/*
  Esta função verifica se o usuário está autenticado.
  - Lê a sessão armazenada no localStorage.
  - Valida se existe sessão.
  - Verifica se a sessão ainda está dentro do tempo válido (2 horas).
  - Remove sessão expirada automaticamente.
*/

export function isAuthenticated(){

  /* Recupera sessão do localStorage */
const session = JSON.parse(localStorage.getItem("session"))

if(!session) return false

const sessionDuration = 2 * 60 * 60 * 1000 // 2 horas
const now = Date.now()

if(now - session.loginTime > sessionDuration){
localStorage.removeItem("session")
return false
}

return true
}