# Getting started
Please run `yarn` or `npm i` to get the dependencies installed in your local.
Once dependencies are installed, run `node index.js` to get your backend environment running in your local.

#### To get all customers - `curl -X GET http://localhost:5000/api/customers`

#### Register a new customer - `curl -X POST http://localhost:5000/api/customers -H "Content-Type: application/json" -d 'DATA-IN-JSON'`

#### Renew a plan for an existing customer - `curl -X POST http://localhost:5000/api/customers/renew/{id} -H "Content-Type: application/json" -d 'DATA-IN-JSON'`

#### Upgrade/Downgrade a plan for an existing customer - `curl -X POST http://localhost:5000/api/customers/upgradeDowngrade/{id} -H "Content-Type: application/json" -d 'DATA-IN-JSON'`
