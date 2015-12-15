Package.describe({
  name: 'tlr:expressive-queries',
  version: '1.0.3',
  // Brief, one-line summary of the package.
  summary: "Expressive queries for Meteor Collections",
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/tedslittlerobot/meteor-expressive-queries.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'underscore', 'check']);
  api.addFiles('expressive-query.js');

  api.export('ExpressiveQuery');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('tlr:expressive-queries');
  api.addFiles(['test-stubs.js', 'expressive-query-tests.js']);
});
