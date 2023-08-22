![EPM Logo](https://cdn.ken.codes/epm-800x450.jpg)

# Ethereum Package Manager

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/kengoldfarb/epm-api/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/kengoldfarb/epm-api/tree/master)

## [https://epm.wtf](https://epm.wtf)

# What is EPM?

EPM lets you deploy and compose smart contracts. It leans heavily into providing functionality for [EIP-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535) contracts.

For a more detailed intro see [Introducing Ethereum Package Manager (EPM)](https://paragraph.xyz/@ken/ethereum-package-manager).

# Installation

1. Install node modules: `yarn`
2. Copy the `.env.example` file to `.env` and fill out required environment variables
3. Run it: `yarn local`
4. Navigate to [http://localhost:3005](http://localhost:3005)

# Code style

CI will fail if the code does not lint. You can check this from the CLI with:

`yarn lint`

You can also auto-fix issues with:

`yarn lint:fix`

It's recommended you use [VSCode](https://code.visualstudio.com/) with these extensions for the best IDE support:

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

# Branches / Deployment

[`master`](https://github.com/kengoldfarb/epm-api/tree/master) is the main development branch. This is also the branch PRs should be submitted against.

Each branch corresponds to an environment that will be automatically updated via CI:

master - [https://api.epm.wtf](https://api.epm.wtf)

# Repositories

Frontend: [https://github.com/kengoldfarb/epm/](https://github.com/kengoldfarb/epm/)

Backend: [https://github.com/kengoldfarb/epm-api/](https://github.com/kengoldfarb/epm-api/)
