# liikunta-saa
TIEA207 projektityö

#### React

Dokumentaatio: <https://reactjs.org/docs/getting-started.html>

#### Axios

Dokumentaatio: <https://axios-http.com/docs/intro>


#### Node.js

Dokumentaatio: <https://nodejs.org/en/docs/>

#### Express

Dokumentaatio: <https://expressjs.com/en/5x/api.html>


#### Eslint

Dokumentaatio: <https://eslint.org/>

VS Code extension: <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>

Jos työskentelet yhdessä workspacessa eli näkyvillä ovat kansiot backend sekä frontend, mene VS Coden setting.json ja lisää seuraava:
```
"eslint.workingDirectories": [
		{ "directory": "./frontend", "changeProcessCWD": true },
        { "directory": "./backend", "changeProcessCWD": true }
	]
```
Jos avaat omat VS Code ikkunat kummallekin kansiolle ei edellistä pitäisi tarvita