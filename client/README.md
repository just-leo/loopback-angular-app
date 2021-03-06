## Getting Started


### Prerequisites


### Install Dependencies

```
npm install
```

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/index.html`.


## Directory Layout

```
app/                    --> all of the source files for the application
  assets/
    css/                --> default stylesheet
    img/                --> images used in templates
    js/                 --> js plugins used in templates
  components/           --> all app specific modules
    version/              --> version related components
      version.js                 --> version module declaration and basic "version" value service
      version_test.js            --> "version" value service tests
      version-directive.js       --> custom directive that returns the current app version
      version-directive_test.js  --> version directive tests
      interpolate-filter.js      --> custom interpolation filter
      interpolate-filter_test.js --> interpolate filter tests
    cron/                        --> component that implement ui for cron format control
    directives/                  --> all useful directives
    services/                   --> the place for LB-service and others common services
  config/                       --> app related configs: router config, autoloader config, api endpoints, default configuration for common components
  core/
    services/           --> api service, main interceptor for common responses and others
    app.core.module.js  --> main application module
  layouts/              --> common templates
  modules/              --> all application's modules for each page and parts of pages
  main.js               --> included in index.html and loads js files (hot dependencies) asynchronously
  index.html            --> app layout file (the main html template file of the app)
karma.conf.js         --> config file for running unit tests with Karma
e2e-tests/            --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
```

## Testing



### Running Unit Tests

The angular-seed app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `karma.conf.js`
* the unit tests are found next to the code they are testing and are named as `..._test.js`.

The easiest way to run the unit tests is to use the supplied npm script:

```
npm test
```

This script will start the Karma test runner to execute the unit tests. Moreover, Karma will sit and
watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit.  This is useful if you want to
check that a particular version of the code is operating as expected.  The project contains a
predefined script to do this:

```
npm run test-single-run
```


### End to end testing

The angular-seed app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `e2e-tests/protractor-conf.js`
* the end-to-end tests are found in `e2e-tests/scenarios.js`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it.

```
npm start
```

## Serving the Application Files

While angular is client-side-only technology and it's possible to create angular webapps that
don't require a backend server at all, we recommend serving the project files using a local
webserver during development to avoid issues with security restrictions (sandbox) in browsers. The
sandbox implementation varies between browsers, but quite often prevents things like cookies, xhr,
etc to function properly when an html page is opened via `file://` scheme instead of `http://`.


### Running the App during Development

The angular-seed project comes preconfigured with a local development webserver.  It is a node.js
tool called [http-server][http-server].  You can start this webserver with `npm start` but you may choose to
install the tool globally:

```
sudo npm install -g http-server
```

Then you can start your own development web server to serve static files from a folder by
running:

```
http-server -a localhost -p 8000
```

Alternatively, you can choose to configure your own webserver, such as apache or nginx. Just
configure your server to serve the files under the `app/` directory.


### Running the App in Production

This really depends on how complex your app is and the overall infrastructure of your system, but
the general rule is that all you need in production are all the files under the `app/` directory.
Everything else should be omitted.

Angular apps are really just a bunch of static html, css and js files that just need to be hosted
somewhere they can be accessed by browsers.

If your Angular app is talking to the backend server via xhr or other means, you need to figure
out what is the best way to host the static files to comply with the same origin policy if
applicable. Usually this is done by hosting the files by the backend server or through
reverse-proxying the backend server(s) and webserver(s).


## Continuous Integration

### Travis CI

[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. The angular-seed
project contains a Travis configuration file, `.travis.yml`, which will cause Travis to run your
tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the Travis website for more
instruction on how to do this.

### CloudBees

CloudBees have provided a CI/deployment setup:

<a href="https://grandcentral.cloudbees.com/?CB_clickstart=https://raw.github.com/CloudBees-community/angular-js-clickstart/master/clickstart.json">
<img src="https://d3ko533tu1ozfq.cloudfront.net/clickstart/deployInstantly.png"/></a>

If you run this, you will get a cloned version of this repo to start working on in a private git repo,
along with a CI service (in Jenkins) hosted that will run unit and end to end tests in both Firefox and Chrome.


## Links

Registartion wizard
http://bootsnipp.com/snippets/OeDVl

Example of form validation on client side combined with serverside errors
<form class="" ng-submit="submit()" name="profileForm" novalidate>
    <div class="form-group clearfix">
        <label class="control-label"><span>Никнейм</span></label>
        <div class="form-field"
             ng-class="{'error':(profileForm.nickname.$touched && profileForm.nickname.$invalid)
             || (profileForm.nickname.$invalid && !profileForm.nickname.$pristine)}">
            <input type="text" class="form-control" ng-model="profile.nickname" name="nickname" ng-required="true">
            <div class="message">Укажите никнейм</div>
            <span class="message show" ng-if="serverErrors.nickname">{{serverErrors.nickname}}</span>
        </div>
    </div>
    <div class="form-group clearfix">
        <label class="control-label"><span>E-mail</span></label>
        <div class="form-field"
             ng-class="{'error':(profileForm.email.$touched && profileForm.email.$invalid)
             || (profileForm.email.$invalid && !profileForm.email.$pristine)}">
            <input type="email" class="form-control" ng-model="profile.email" name="email" ng-required="true">
            <div class="message">Указан неправильный email</div>
            <span class="message show" ng-if="serverErrors.email">{{serverErrors.email}}</span>
        </div>
    </div>
    <div class="form-rightpart show">
        <button class="btn-reset btn-form" type="submit" ng-disabled="profileForm.$invalid">сохранить</button>
    </div>
</form>