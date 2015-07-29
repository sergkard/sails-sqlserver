Unofficial Microsoft SQL Server adapter for [waterline](https://github.com/balderdashy/waterline). Tested on SQL Server 2008, but should support any SQL Server 2005 and newer.

### 1. Install
```sh
$ npm install waterline-sqlserver --save
```

### 2. Configure

#### `config/model.js`
```js
{
  connection: 'sqlserver'
}
```

#### `config/connections.js`
```js
{
  sqlserver: {
    adapter: 'waterline-sqlserver',
    user: 'cnect',
    password: 'pass',
    host: 'abc123.database.windows.net' // azure database
    database: 'mydb',
    options: {
      encrypt: true   // use this for Azure databases
    }
  }
}
```
