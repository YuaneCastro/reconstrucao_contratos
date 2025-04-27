# Usar uma imagem oficial do Node.js como imagem base
FROM node:16

# Criar e definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de dependência do projeto (package.json e package-lock.json)
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto para o container
COPY . .

# Expor a porta que o seu servidor vai rodar
EXPOSE 3000

# Comando para rodar sua aplicação Node.js
CMD ["npm", "start"]
