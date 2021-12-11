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

Leaflet.markercluster: https://github.com/Leaflet/Leaflet.markercluster

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

### Leaflet.markercluster

Dokumentaatio: <https://github.com/Leaflet/Leaflet.markercluster>


### MetOLib (mahdollisesti käytetään)
Dokumentaatio: <https://github.com/fmidev/metolib>

### Bootstrap
Dokumentaatio: <https://getbootstrap.com/docs/4.1/getting-started/introduction/>

### React-Bootstrap
Dokumentaatio: <https://react-bootstrap.github.io/getting-started/introduction/>

### React-Infinite-Scroll-Component
Dokumentaatio: <https://github.com/ankeetmaini/react-infinite-scroll-component#readme>

## APIt tms

### Lipas
<https://github.com/lipas-liikuntapaikat/lipas-api>

### Ilmatieteen laitos
<https://en.ilmatieteenlaitos.fi/open-data-manual>

### OpenStreetMap
Dokumentaatio: <https://wiki.openstreetmap.org/wiki/API_v0.6>

Tuolta wikistä löytyy muutakin dokumentaatiota esim. featureista, mutta tuossa on API

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Käytettyjen kirjastojen lisenssit

### Leaflet
```
BSD 2-Clause License

Copyright (c) 2010-2021, Vladimir Agafonkin
Copyright (c) 2010-2011, CloudMade
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### React-Leaflet
```
Copyright 2020 Paul Le Cam and contributors (“Licensor”)

Hippocratic License Version Number: 2.1.

Purpose. The purpose of this License is for the Licensor named above to permit the Licensee (as defined below) broad permission, if consistent with Human Rights Laws and Human Rights Principles (as each is defined below), to use and work with the Software (as defined below) within the full scope of Licensor’s copyright and patent rights, if any, in the Software, while ensuring attribution and protecting the Licensor from liability.

Permission and Conditions. The Licensor grants permission by this license (“License”), free of charge, to the extent of Licensor’s rights under applicable copyright and patent law, to any person or entity (the “Licensee”) obtaining a copy of this software and associated documentation files (the “Software”), to do everything with the Software that would otherwise infringe (i) the Licensor’s copyright in the Software or (ii) any patent claims to the Software that the Licensor can license or becomes able to license, subject to all of the following terms and conditions:

Acceptance. This License is automatically offered to every person and entity subject to its terms and conditions. Licensee accepts this License and agrees to its terms and conditions by taking any action with the Software that, absent this License, would infringe any intellectual property right held by Licensor.

Notice. Licensee must ensure that everyone who gets a copy of any part of this Software from Licensee, with or without changes, also receives the License and the above copyright notice (and if included by the Licensor, patent, trademark and attribution notice). Licensee must cause any modified versions of the Software to carry prominent notices stating that Licensee changed the Software. For clarity, although Licensee is free to create modifications of the Software and distribute only the modified portion created by Licensee with additional or different terms, the portion of the Software not modified must be distributed pursuant to this License. If anyone notifies Licensee in writing that Licensee has not complied with this Notice section, Licensee can keep this License by taking all practical steps to comply within 30 days after the notice. If Licensee does not do so, Licensee’s License (and all rights licensed hereunder) shall end immediately.

Compliance with Human Rights Principles and Human Rights Laws.

Human Rights Principles.

(a) Licensee is advised to consult the articles of the United Nations Universal Declaration of Human Rights and the United Nations Global Compact that define recognized principles of international human rights (the “Human Rights Principles”). Licensee shall use the Software in a manner consistent with Human Rights Principles.

(b) Unless the Licensor and Licensee agree otherwise, any dispute, controversy, or claim arising out of or relating to (i) Section 1(a) regarding Human Rights Principles, including the breach of Section 1(a), termination of this License for breach of the Human Rights Principles, or invalidity of Section 1(a) or (ii) a determination of whether any Law is consistent or in conflict with Human Rights Principles pursuant to Section 2, below, shall be settled by arbitration in accordance with the Hague Rules on Business and Human Rights Arbitration (the “Rules”); provided, however, that Licensee may elect not to participate in such arbitration, in which event this License (and all rights licensed hereunder) shall end immediately. The number of arbitrators shall be one unless the Rules require otherwise.

Unless both the Licensor and Licensee agree to the contrary: (1) All documents and information concerning the arbitration shall be public and may be disclosed by any party; (2) The repository referred to under Article 43 of the Rules shall make available to the public in a timely manner all documents concerning the arbitration which are communicated to it, including all submissions of the parties, all evidence admitted into the record of the proceedings, all transcripts or other recordings of hearings and all orders, decisions and awards of the arbitral tribunal, subject only to the arbitral tribunal's powers to take such measures as may be necessary to safeguard the integrity of the arbitral process pursuant to Articles 18, 33, 41 and 42 of the Rules; and (3) Article 26(6) of the Rules shall not apply.

Human Rights Laws. The Software shall not be used by any person or entity for any systems, activities, or other uses that violate any Human Rights Laws. “Human Rights Laws” means any applicable laws, regulations, or rules (collectively, “Laws”) that protect human, civil, labor, privacy, political, environmental, security, economic, due process, or similar rights; provided, however, that such Laws are consistent and not in conflict with Human Rights Principles (a dispute over the consistency or a conflict between Laws and Human Rights Principles shall be determined by arbitration as stated above). Where the Human Rights Laws of more than one jurisdiction are applicable or in conflict with respect to the use of the Software, the Human Rights Laws that are most protective of the individuals or groups harmed shall apply.

Indemnity. Licensee shall hold harmless and indemnify Licensor (and any other contributor) against all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of whatever kind, including Licensor’s reasonable attorneys’ fees, arising out of or relating to Licensee’s use of the Software in violation of Human Rights Laws or Human Rights Principles.

Failure to Comply. Any failure of Licensee to act according to the terms and conditions of this License is both a breach of the License and an infringement of the intellectual property rights of the Licensor (subject to exceptions under Laws, e.g., fair use). In the event of a breach or infringement, the terms and conditions of this License may be enforced by Licensor under the Laws of any jurisdiction to which Licensee is subject. Licensee also agrees that the Licensor may enforce the terms and conditions of this License against Licensee through specific performance (or similar remedy under Laws) to the extent permitted by Laws. For clarity, except in the event of a breach of this License, infringement, or as otherwise stated in this License, Licensor may not terminate this License with Licensee.

Enforceability and Interpretation. If any term or provision of this License is determined to be invalid, illegal, or unenforceable by a court of competent jurisdiction, then such invalidity, illegality, or unenforceability shall not affect any other term or provision of this License or invalidate or render unenforceable such term or provision in any other jurisdiction; provided, however, subject to a court modification pursuant to the immediately following sentence, if any term or provision of this License pertaining to Human Rights Laws or Human Rights Principles is deemed invalid, illegal, or unenforceable against Licensee by a court of competent jurisdiction, all rights in the Software granted to Licensee shall be deemed null and void as between Licensor and Licensee. Upon a determination that any term or provision is invalid, illegal, or unenforceable, to the extent permitted by Laws, the court may modify this License to affect the original purpose that the Software be used in compliance with Human Rights Principles and Human Rights Laws as closely as possible. The language in this License shall be interpreted as to its fair meaning and not strictly for or against any party.

Disclaimer. TO THE FULL EXTENT ALLOWED BY LAW, THIS SOFTWARE COMES “AS IS,” WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED, AND LICENSOR AND ANY OTHER CONTRIBUTOR SHALL NOT BE LIABLE TO ANYONE FOR ANY DAMAGES OR OTHER LIABILITY ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THIS LICENSE, UNDER ANY KIND OF LEGAL CLAIM.

This Hippocratic License is an Ethical Source license (https://ethicalsource.dev) and is offered for use by licensors and licensees at their own risk, on an “AS IS” basis, and with no warranties express or implied, to the maximum extent permitted by Laws.
```

### Leaflet.markercluster
```
Copyright 2012 David Leaver

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### MetOlib
```
This software may be freely distributed and used under the following MIT license:

Copyright (c) 2013 Finnish Meteorological Institute

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### React-TimeRange-Picker
```
MIT License

Copyright (c) 2017–2021 Wojciech Maj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```