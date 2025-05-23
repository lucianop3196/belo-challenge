<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">Belo Technical Challenge</h1>

<p align="center">
  Proyecto desarrollado como parte del proceso de selección técnica de <a href="https://belo.app" target="_blank">Belo</a>.
</p>

---

## 📦 Descripción

Este repositorio contiene una aplicación backend construida con el framework [NestJS](https://nestjs.com/), escrita en TypeScript.

La app se conecta a una base de datos que se levanta usando Docker.

---

## 🚀 Levantar el proyecto

### 1. Clonar e instalar dependencias

```
git clone https://github.com/lucianop3196/belo-challenge.git
cd belo-challenge
yarn install
```

### 2. Levantar la base de datos

Asegurate de tener Docker y Docker Compose instalados. Luego ejecutá:

```
docker compose up -d
```

### 3. Iniciar la aplicación

```
yarn run start:dev
```

### 4. Documentación
La documentacion de los endpoints se encuentra en swagger y se puede acceder a la misma en la siguiente ruta:
```
http://localhost:3000/docs
```

### 5. Observaciones
Para poder consumir los endpoint deberás agregar el siguiente header en las peticiones
```
x-api-key: 822c166d-bad8-4553-9d41-842753444b54
```

También deberás tener creado un archivo .env en la raíz del proyecto, con la siguiente información.

```
PORT = 3000
API_KEY="822c166d-bad8-4553-9d41-842753444b54"
TZ="America/Argentina/Buenos_Aires"
DB_HOST="localhost"
DB_PORT=5432
DB_USERNAME="belo"
DB_PASSWORD="mGkqCdtSy2z8E4tG7ary"
DB_NAME="belo"
DB_SYNC="true" #TODO: Cuidado en produccion

DB_HOST_TEST="localhost"
DB_PORT_TEST=5432
DB_USERNAME_TEST="belo"
DB_PASSWORD_TEST="mGkqCdtSy2z8E4tG7ary"
DB_NAME_TEST="belo_test"
```