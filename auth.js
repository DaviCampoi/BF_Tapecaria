export function isAuthenticated(){

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