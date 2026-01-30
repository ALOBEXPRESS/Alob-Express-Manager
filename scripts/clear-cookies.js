/**
 * Script de Limpeza de Cookies - Alob Express Manager
 * 
 * Este script limpa todos os cookies do domínio atual para resolver
 * o erro 431 (Request Header Fields Too Large)
 * 
 * COMO USAR:
 * 1. Abra o DevTools do navegador (F12)
 * 2. Vá para a aba "Console"
 * 3. Cole este script completo
 * 4. Pressione Enter
 * 5. Recarregue a página (F5)
 */

(function clearAllCookies() {
  console.log('🧹 Iniciando limpeza de cookies...');
  
  // Obter todos os cookies
  const cookies = document.cookie.split(';');
  let count = 0;
  
  // Deletar cada cookie
  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    
    // Deletar para o domínio atual
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Deletar para subdomínios
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    
    // Deletar para domínio raiz
    const domain = window.location.hostname.split('.').slice(-2).join('.');
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
    
    count++;
  });
  
  console.log(`✅ ${count} cookies deletados com sucesso!`);
  console.log('🔄 Recarregue a página agora (F5)');
  
  // Limpar localStorage e sessionStorage também
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ localStorage e sessionStorage limpos!');
  
  // Verificar se ainda há cookies
  setTimeout(() => {
    const remaining = document.cookie.split(';').filter(c => c.trim()).length;
    if (remaining > 0) {
      console.warn(`⚠️ Ainda restam ${remaining} cookies. Pode ser necessário limpar manualmente.`);
      console.log('💡 Vá em DevTools > Application > Cookies e delete manualmente.');
    } else {
      console.log('✅ Todos os cookies foram removidos!');
    }
  }, 1000);
})();
