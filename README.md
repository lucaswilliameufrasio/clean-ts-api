# ForDev NodeJS

<div align="center">
<img width="200"
src="https://user-images.githubusercontent.com/34021576/106562432-0cdf3d80-6509-11eb-9004-556737c3cdb3.png" alt="4Dev Logo"
    />
</div>

This project was built following along the training of [Rodrigo Manguinho on Udemy](https://www.udemy.com/course/tdd-com-mango/) and has the purpose to learn to build Web Services with NodeJS following best practices, applying SOLID, TDD, Design Patterns, Clean Architecture, DDD, and so on. We also had added Swagger, Docker, and CI/CD with Travis that then i have modified it to run in Github Actions.

<h2 id="requirements">🖥 Requirements </h2>

- Git
- Node [version 12.x](https://nodejs.org/en/download/releases/)
- MongoDB [version 4.x](https://docs.mongodb.com/manual/installation/)

### Optional
- Docker
- Docker Compose


## Clone the repository

``` bash
$ git clone https://github.com/lucaswilliameufrasio/clean-ts-api.git
```

## 🔨 Configuration

- Navigate to project's folder

``` bash
$ cd clean-ts-api
```

- Install dependencies

``` bash
$ yarn install
```

- Copy environment file:


``` bash
$ cp .env.example .env
```

The .env file could be like the example below:

```
MONGO_URL=mongodb://localhost:27017/clean-node-api
PORT=7777
JWT_SECRET=IhTqDm7i1QzKd5k7Bf9CXbU3KZt1Kddgifn2MH5gff1xWjsB
```



<h2 id="usage">📦 Usage</h2>

- To run the app in development mode:

``` bash
$ yarn build
$ yarn debug
```

- Then open http://localhost:7777/api/docs

- To run tests:

``` bash
$ yarn test:ci
```



