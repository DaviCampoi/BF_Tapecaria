/*
  Este arquivo Dockerfile define o ambiente da aplicação Node.js.
  - Utiliza uma imagem leve do Node (alpine).
  - Cria um usuário não-root por segurança.
  - Instala dependências do projeto.
  - Copia os arquivos da aplicação.
  - Expõe a porta 3000.
  - Inicia o servidor com npm.
*/

FROM node:20-alpine

/* Cria usuário e grupo não-root para segurança */
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

/* Define diretório de trabalho */
WORKDIR /app

/* Copia arquivos de dependência */
COPY package*.json ./

/* Instala dependências e limpa cache */
RUN npm install && \
    npm cache clean --force

/* Copia restante do projeto */
COPY . .

/* Define usuário padrão */
USER appuser

/* Expõe a porta da aplicação */
EXPOSE 3000

/* Comando para iniciar o servidor */
CMD ["npm", "run", "server"]