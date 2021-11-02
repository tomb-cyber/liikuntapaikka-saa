# liikunta-saa
TIEA207 projektityö

### React

Dokumentaatio: <https://reactjs.org/docs/getting-started.html>

### Axios

Dokumentaatio: <https://axios-http.com/docs/intro>


### Node.js

Dokumentaatio: <https://nodejs.org/en/docs/>

### Express

Dokumentaatio: <https://expressjs.com/en/5x/api.html>


### Eslint

Dokumentaatio: <https://eslint.org/>

VS Code extension: <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>

Jos työskentelet yhdessä workspacessa eli näkyvillä ovat kansiot backend sekä frontend, mene VS Coden settings.json ja lisää seuraava:
```
"eslint.workingDirectories": [
		{ "directory": "./frontend", "changeProcessCWD": true },
        	{ "directory": "./backend", "changeProcessCWD": true }
	]
```
Jos avaat omat VS Code ikkunat kummallekin kansiolle ei edellistä pitäisi tarvita


### Leaflet
Dokumentaatio: <https://leafletjs.com/reference-1.7.1.html>

### React-Leaflet
Dokumentaatio: <https://react-leaflet.js.org/docs/start-introduction/>

React-Leafletin pitäisi nyt toimia, mutta jos nullish coalescing -ongelmaa esiintyy sen alkuperäinen ratkaisu oli seuraavanlainen:

Kohta 1: Package.json tiedoston kohta

```
"browserslist": {
   "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
},
```

muokataan seuraavanlaiseksi

```
  "browserslist": [
    ">0.2%",
    "not dead",
    "not op_mini all"
  ],
  ```
  
Kohta 2: Seuraavaksi poistetaan node_modules/.cache -kansio.

Kohta 3: Viimeiseksi ajetaan npm install, jonka jälkeen npm start ja suorituksen ei pitäisi pysähtyä nullish coalescing -ongelmaan.


### MetOLib (mahdollisesti käytetään)
Dokumentaatio: <https://github.com/fmidev/metolib>

### Bootstrap
Dokumentaatio: <https://getbootstrap.com/docs/4.1/getting-started/introduction/>

### React-Bootstrap
Dokumentaatio: <https://react-bootstrap.github.io/getting-started/introduction/>

## APIt tms

### Lipas
<https://github.com/lipas-liikuntapaikat/lipas-api>

### Ilmatieteen laitos
<https://en.ilmatieteenlaitos.fi/open-data-manual>

### OpenStreetMap
Dokumentaatio: <https://wiki.openstreetmap.org/wiki/API_v0.6>

Tuolta wikistä löytyy muutakin dokumentaatiota esim. featureista, mutta tuossa on API


