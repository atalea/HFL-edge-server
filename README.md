# HFL Edge Server Set Up

1. install node - lts
2. install npm
3. clone this repo
4. cd into repo
5. install dependencies with:

```
npm i
```

to start production server run: 
``` 
npm start
```
or for devolpment run:
```
npm run start:dev
```

create a .env file containing:

```
TOKEN=Token goes here
CENTRAL_SERVER=central server ip goes here
```


after any git pulls make sure to run 
```
npm i
```
