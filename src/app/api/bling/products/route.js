import { NextResponse } from 'next/server';

export async function GET(request) {
  // Em um cenário real, você pegaria isso de variáveis de ambiente
  // const BLING_API_KEY = process.env.BLING_API_KEY; 
  
  // Exemplo de URL da API do Bling (ajuste conforme a versão que você for usar, v2 ou v3)
  // v3 requer OAuth, v2 usa apikey na query string
  
  try {
    // Simulação de chamada ao Bling
    // const response = await fetch(`https://bling.com.br/Api/v2/produtos/json/?apikey=${process.env.BLING_API_KEY}`);
    // const data = await response.json();

    const mockData = {
      message: "Integração Bling Configurada (Exemplo)",
      produtos: [
        { id: 1, nome: "Produto Exemplo 1", preco: 100.00 },
        { id: 2, nome: "Produto Exemplo 2", preco: 59.90 }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao conectar com o Bling' }, { status: 500 });
  }
}
