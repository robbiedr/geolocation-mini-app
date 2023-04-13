
# Geolocation API

A Geolocation mini-app


## Authors

- [Robbie del Rosario](mailto:robbievdelrosario@gmail.com)


## Project setup

- Install dependencies with npm

  ```bash
  npm install
  ```
- Run docker
  ```bash
  npm run docker
  ```
- Create `.env` file and refer to `.env-sample` file
  ```env
  // Sample values
  DB_USERNAME=root
  DB_PASSWORD=root_password
  DB_DATABASE=database_name
  DB_HOST=127.0.0.1
  DB_PORT=3306
  APP_PORT=3001
  ```
- Run migrations and seeders
  ```bash
  npm run migrate
  npm run seed
  ```
- Run the app 
  ```bash
  npm run dev
  ```
  
## API Reference

#### Get treasure boxes

```http
  GET /treasure-boxes
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `latitude` | `float` | **Required**. Latitude |
| `longitude` | `float` | **Required**. Longitude |
| `distance` | `number` | **Required**. Distance (1/10 (km)) |
| `prizeValue` | `number` | (Optional) Prize value ($10-$30) |

#### Get treasure boxes by IP Address

```http
  GET /treasure-boxes/ip-address/${ipAddress}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ipAddress` | `string` | **Required**. IP Address to get location |
| `distance` | `number` | **Required**. Distance (1/10 (km)) |
| `prizeValue` | `number` | (Optional) Prize value ($10-$30) |

#### Get data

```http
  GET /data
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `scope` | `string` | **Required**. Scope of data |

| Scope | Description |
| :---- | :---------- |
| `treasures` | Returns data from treasures table |
| `users` | Returns data from users table |
| `money_values` | Returns data from money_values table |
| `treasures-money_values` | Returns data from treasures table + associated money_values data | 
