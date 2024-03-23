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

## FASE 2 - Evolução

![Fase2_HACK_SOAT1 drawio](https://github.com/SOAT-01/hackathon-monolithic/assets/23150778/b55b6de2-a678-46b3-9f61-1a5ebde4e3f3)

- **desempenho:** o nosso cluster terá HPA para redimensionar a quantidade de pods disponíveis conforme o número de transações aumentar.
- **disponibilidade e escalabilidade:** vamos garantir usando o EKS onde vamos configurar os horários de pico que podem ter mais réplicas do serviço de Registro de ponto, e também mais alguns parâmetros para processamento. Com Load Balancers vamos garantir a disponibilidade, para caso instâncias falhem para redirecionar o tráfego para instâncias saudáveis.
- **segurança:** a lambda authorizer junto com api gateway vai proteger o acesso às nossas API's apenas por usuários autenticados. E também usaremos a parte de criptografia da AWS no RDS para os dados.
- **integridade dos dados:** como usaremos a saga coreografada, já que não são muitos serviços e comunicações. Um registro de ponto só será alterado quando o serviço de análise publicar na fila de análises finalizadas. E por sua vez, o serviço de análises, só irá publicar o registro nessa fila apenas se o banco de dados retornar sucesso. 
- **manutenibilidade:** os serviços estarão em repositórios diferentes, cada qual com sua responsabilidade e contexto e no código vamos manter o padrão de clean archtecture.
- **resiliência:** a princípio manteremos os load balancers em cada serviço para garantir o redirecionamento das requisições para instâncias saudáveis.
- **conformidade:** através da requisição de anonimização de dados no serviço de usuários, vamos garantir a LGPD.

### Sobre a arquitetura da fase 2  no geral:

- Mantivemos a autenticação apartada em uma lambda authorizer com API gateway para garantir o acesso apenas por usuários autorizados.
- Em relação a segurança dos dados, como usaremos o RDS para gerenciar nosso banco Postgres, terá a criptografia garantida pela AWS.
- Dividimos nossa aplicação em serviços para garantir que o principal serviço que é o registro de ponto não fique sobrecarregado e para que haja uma separação de responsabilidades e consigamos escalar apenas onde for necessário, ter mais resiliência e autonomia.
    - O serviço de registro de ponto, vai apenas registrar as entradas e saidas de usuários, enviar a notificação nos horários para que os usuários batam o ponto através de uma fila e também solicitar alterações de ponto para o serviço de aprovação.
    - O serviço de aprovação receberá através de POST as solicitações, e quando analisadas, publicará numa fila que é consumida pelo serviço de registrar ponto para finalizar o ajuste solicitado. Esse serviço usa MongoDB pela flexibilidade de esquema, desempenho e disponibilidade.
    - O serviço de usuários separado para a parte de administração de usuários. Escolhemos o banco de dados relacional por conta da estrutura de dados organizada e também por conta de ser transacional e ter o padrão ACID e ainda contar com a criptografia da AWS no RDS.
    - Por fim o serviço de relatórios, ele requisita através de GET os registros para o serviço Registro de ponto, processa esses dados e armazena em cache temporário, também publica os dados organizados em uma fila que será consumida por uma função Lambda que enviará o email. Usamos o cache para oferecer atomicidade caso o relatório ja tenha sido gerado e para não sobrecarregar o serviço de registro de ponto.
- As filas usamos o SQS da AWS, pois ja usamos outros serviços da AWS e por conta da simplicidade, considerando que existiam poucas comunicações implementadas entre os serviços.




