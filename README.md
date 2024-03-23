# Pós Tech FIAP - Hackathon - SOAT1 - Grupo 5

Projeto do hackathon da pós tech Fiap Arquitetura de Software

## Como rodar o projeto (Docker)

Fazer o clone e ir na pasta do projeto (por exemplo: fiap-soat1-hackathon)

```shell
cd fiap-soat1-hackathon
```

Subir os contâineres do Postgres e do Node usando o arquivo docker-compose.yml:

```shell
docker compose -f docker-compose.yml up -d
```

Verificar se subiram os containeres fastFoodMongodb e fastFoodApi:

```shell
docker ps
```

## Como rodar o projeto para desenvolvimento local (Local + Containers) 
Fazer o clone e ir na pasta do projeto (por exemplo: fiap-soat1-hackathon)

```shell
cd fiap-soat1-hackathon
```
Subir os contâineres do MongoDB e PostgreSQL:

```shell
# Container PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=root -e POSTGRES_USER=root -e POSTGRES_DB=hackathon postgres
```

Executar script para gerar migrations do PostgreSQL 
- Necessário apenas em mudanças de schema
```shell
npm run generate
```

Executar script para executar migrations do PostgreSQL 
- Necessário apenas em mudanças de schema
```shell
npm run migrate
```
## Documentação das API's

Em qualquer navegador acessar a url:

```shell
http://localhost:6001/api-docs
```
