hawtio-forge [![Circle CI](https://circleci.com/gh/hawtio/hawtio-forge.svg?style=svg)](https://circleci.com/gh/hawtio/hawtio-forge)
-----------------------------------------------------------------------------------------------------------------------------------

This plugin provides a [Forge](http://forge.jboss.org/) console for hawtio

### Basic usage

#### Running this plugin locally

First clone the source

```
git clone https://github.com/hawtio/hawtio-forge.git
cd hawtio-forge
```

Next you'll need to [install NodeJS](http://nodejs.org/download/) and then install the default global npm dependencies:

```
npm install -g bower gulp slush slush-hawtio-javascript slush-hawtio-typescript typescript
```

Then install all local nodejs packages and update bower dependencies via:

```
npm install
bower update
```

Then to run the web application:

```
gulp
```

The build talks to the [Forge REST API](https://github.com/fabric8io/forge-rest-service)

#### Install the bower package

`bower install --save hawtio-forge`
