/*
  Este Dockerfile utiliza multi-stage build para aplicações front-end.
  - Primeiro estágio (build): instala dependências e gera os arquivos estáticos.
  - Segundo estágio (produção): utiliza Nginx para servir os arquivos buildados.
  - Resultado: imagem mais leve e otimizada para produção.
*/

FROM node:20-alpine AS build

/* Define diretório de trabalho */
WORKDIR /app

/* Copia arquivos de dependência */

COPY package*.json ./

/* Instala dependências e limpa cache */
RUN npm install && \
    npm cache clean --force
    
/* Copia restante do projeto */
COPY . .

/* Executa build da aplicação (gera /dist) */
RUN npm run build

/* Imagem final com Nginx */
FROM nginx:stable-alpine

/* Copia arquivos buildados para pasta pública do Nginx */
COPY --from=build /app/dist /usr/share/nginx/html

/* Expõe porta padrão do Nginx */
EXPOSE 80

/* Inicia servidor Nginx */
CMD ["nginx", "-g", "daemon off;"]