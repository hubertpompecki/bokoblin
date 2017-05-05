# Bokoblin
Bokoblin is an opinionated scaffolding generator for AWS Lambda functions. It bundles together a set of tools which facilitate fast development and deployment of Lambda functions by providing:
- flow
- jasmine
- webpack
- deployment scripts

## Requirements
- aws-cli tool

## Usage

### Installation
Install _globally_ with either npm
```
npm install bokoblin -g
```
or Yarn
```
yarn global add bokoblin
```
Then initialize your test suite with

```
yarn test init
```

Develop your code in `app/component.js`.

### Generating a lambda
To generate a new lambda function you need to specify its name and the indentifier of the IAM role which Amazon will assign to it.
```
bokoblin MyNewFunction arn:aws:iam::123456789123456:role/lambda_basic_execution
```

### Scripts
You get the following out of the box:
- `yarn flow` - carries out static type checking with flow
- `yarn build` - builds the function into `build/component.js`
- `yarn test` - builds the function and runs jasmine specs
- `yarn push` - build the function, runs specs, and pushes to Amazon AWS
