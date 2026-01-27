# Project Setup

After cloning this repository, follow these steps to set up your development environment:

### Install dependencies

Using npm:
```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Run the test suite

The test suite will automatically start and stop the Next.js dev server as needed. Simply run:

```bash
npx jest
```
or to run a specific test file:

```bash
npx jest src/app/__tests__/page.puppeteer.test.ts
```

Test output will indicate pass/fail status for each test.