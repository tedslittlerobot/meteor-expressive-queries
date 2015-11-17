
// ****************************************************************************
// *                              Output Getters                              *
// ****************************************************************************

Tinytest.add('ExpressiveQuery#selector getter', function (test) {
  var scope = new ExpressiveQuery;

  scope._query = 'foobar';

  test.equal(scope.selector, 'foobar');
});

Tinytest.add('ExpressiveQuery#options getter', function (test) {
  var scope = new ExpressiveQuery;

  test.equal(scope.options, {}, 'New query scope objects should be empty');

  scope = new ExpressiveQuery;

  scope._sort      = 'sort';
  scope._skip      = 'skip';
  scope._limit     = 'limit';
  scope._fields    = 'fields';
  scope._reactive  = 'reactive';
  scope._transform = 'transform';

  test.equal(scope.options, {
    sort:      'sort',
    skip:      'skip',
    limit:     'limit',
    fields:    'fields',
    reactive:  'reactive',
    transform: 'transform'
  }, 'All options should be available');

  scope = new ExpressiveQuery;

  scope._sort = 'foo';
  scope._skip = 'bar';

  test.equal(scope.options, {
    sort: 'foo',
    skip: 'bar'
  }, 'Options should be left out when empty or null');
});

// ****************************************************************************
// *                              Regular Setters                             *
// ****************************************************************************

Tinytest.add('ExpressiveQuery#skip() setter', function (test) {
  var scope = new ExpressiveQuery;

  scope.skip(4);
  test.equal(scope._skip, 4);

  scope.skip(10);
  test.equal(scope._skip, 10);
});

Tinytest.add('ExpressiveQuery#limit() setter', function (test) {
  var scope = new ExpressiveQuery;

  scope.limit(4);
  test.equal(scope._limit, 4);

  scope.limit(10);
  test.equal(scope._limit, 10);
});

Tinytest.add('ExpressiveQuery#reactive() setter', function (test) {
  var scope = new ExpressiveQuery;

  scope.reactive(true);
  test.equal(scope._reactive, true);

  scope.reactive(false);
  test.equal(scope._reactive, false);
});

Tinytest.add('ExpressiveQuery#transform() setter', function (test) {
  var scope = new ExpressiveQuery;

  var noop  = function() {};
  var noop2 = function() {};

  scope.transform(noop);
  test.equal(scope._transform, noop);

  scope.transform(noop2);
  test.equal(scope._transform, noop2);
});


// ****************************************************************************
// *                         Merge Setters for Objects                        *
// ****************************************************************************

Tinytest.add('ExpressiveQuery#query() setter', function (test) {
  var scope = new ExpressiveQuery;

  scope.query({a: 1});
  scope.query({b: 2});

  test.equal(scope._query, {a: 1, b: 2});
});

Tinytest.add('ExpressiveQuery#sort() setter', function (test) {
  var scope = new ExpressiveQuery;

  scope.sort({a: 1});
  scope.sort({b: 2});

  test.equal(scope._sort, {a: 1, b: 2});
});

Tinytest.add('ExpressiveQuery#fields() setter', function (test) {
  var scope = new ExpressiveQuery;

  scope.fields({a: 1});
  scope.fields({b: 2});

  test.equal(scope._fields, {a: 1, b: 2});
});

// ****************************************************************************
// *                              Export Methods                              *
// ****************************************************************************

Tinytest.add('ExpressiveQuery.export()', function (test) {
  ExpressiveQuery.export(StubCollection, ExpressiveQuery);

  test.equal(
    StubCollection.ExpressiveQuery,
    ExpressiveQuery,
    'There should be a ExpressiveQuery property on the collection'
  );

  test.instanceOf(StubCollection.EQ, Function);

  test.instanceOf(StubCollection.EQ(), ExpressiveQuery);
});

Tinytest.add('ExpressiveQuery#result()', function (test) {
  ExpressiveQuery.export(StubCollection, ExpressiveQuery);

  var scope = StubCollection.EQ();

  scope.query({a: 1});
  scope.sort({b: 1});

  test.equal(scope.result(), {
    name: 'findOne',
    selector: {a: 1},
    options: {sort: {b: 1}}
  });
});

Tinytest.add('ExpressiveQuery#results()', function (test) {
  ExpressiveQuery.export(StubCollection, ExpressiveQuery);

  var scope = StubCollection.EQ();

  scope.query({a: 1});
  scope.sort({b: 1});

  test.equal(scope.results(), {
    name: 'find',
    selector: {a: 1},
    options: {sort: {b: 1}}
  });
});
