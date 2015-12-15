
/**
 * Expressive Query class
 */
class Query {
  constructor() {
    this._collection  = null;

    // query
    this._query       = {};

    // options
    this._sort        = {};
    this._skip        = undefined;
    this._limit       = undefined;
    this._fields      = {};
    this._reactive    = undefined;
    this._transform   = undefined;
  }

// ****************************************************************************
// *                                  Setters                                 *
// ****************************************************************************

  // Simple

  /**
   * Set the skip value
   *
   * @param  Number value
   * @return this
   */
  skip(value) {
    check(value, Number);
    this._skip = value;
    return this;
  }

  /**
   * Set the limit value
   *
   * @param  Number value
   * @return this
   */
  limit(value) {
    check(value, Number);
    this._limit = value;
    return this;
  }

  /**
   * Set the reactive value
   *
   * @param  boolean value
   * @return this
   */
  reactive(value) {
    check(value, Boolean);
    this._reactive = value;
    return this;
  }

  /**
   * Set the transform value
   *
   * @param  Function value
   * @return this
   */
  transform(value) {
    check(value, Match.OneOf(Function, null));
    this._transform = value;
    return this;
  }


  // Merge

  /**
   * Merge a query onto the current query stack
   *
   * @param  Object value
   * @return this
   */
  query(value) {
    check(value, Object);
    this._query = _.extend(this._query, value);
    return this;
  }

  /**
   * Merge a query onto the current sort stack
   *
   * @param  Object value
   * @return this
   */
  sort(value) {
    check(value, Object);
    this._sort = _.extend(this._sort, value);
    return this;
  }

  /**
   * Merge a query onto the current fields stack
   *
   * @param  Object value
   * @return this
   */
  fields(value) {
    check(value, Object);
    this._fields = _.extend(this._fields, value);
    return this;
  }

// ****************************************************************************
// *                              Output Getters                              *
// ****************************************************************************

  /**
   * Get the query selector
   *
   * @return Object
   */
  get selector() {
    return this._query;
  }

  /**
   * Get the query options
   *
   * @return Object
   */
  get options() {
    let options = _.reduce(['sort', 'fields'], (memo, key) =>
      _.isEmpty(this['_'+key]) ? memo : Query.obj(key, this['_'+key], memo),
    {});

    return _.reduce(['skip', 'limit', 'reactive', 'transform'], (memo, key) =>
      this['_'+key] === undefined ? memo : Query.obj(key, this['_'+key], memo),
    options);
  }

// ****************************************************************************
// *                                 Executors                                *
// ****************************************************************************

  /**
   * Execute the query as a "find" query
   *
   * @return Mongo.cursor
   */
  results() {
    if (! this._collection) return;

    return this._collection.find(this.selector, this.options);
  }

  /**
   * Execute the query as a "findOne" query
   *
   * @return Object
   */
  result() {
    if (! this._collection) return;

    return this._collection.findOne(this.selector, this.options);
  }

// ****************************************************************************
// *                              Static Helpers                              *
// ****************************************************************************

  /**
   * Add the key-value pair to the object
   *
   * @param  string key
   * @param  mixed  value
   * @param  Object options
   * @return Object
   */
  static obj(key, value, options) {
    options = options || {};

    options[key] = value;

    return options;
  }

  /**
   * A helper to set a latest sorter. It returns the Query class,
   * for static chainability
   *
   * @param  Query scope
   * @param  string     field
   * @return Query
   */
  static latest(scope, field) {
    scope.sort(Query.obj(field, -1));

    return Query;
  }

  /**
   * A helper to set an oldest sorter. It returns the Query class,
   * for static chainability
   *
   * @param  Query scope
   * @param  string     field
   * @return Query
   */
  static oldest(scope, field) {
    scope.sort(Query.obj(field, 1));

    return Query;
  }

// ****************************************************************************
// *                             Exporter (Static)                            *
// ****************************************************************************

  /**
   * Export a query scope to a collection
   *
   * @param  Mongo.collection collection
   * @param  ExpressiveQuery            SubScope
   * @return ExpressiveQuery
   */
  static export(collection, SubScope) {
    collection.ExpressiveQuery = SubScope;

    // add constructor function
    collection.EQ = function() {
      // this is a trick to forward the function arguments to the constructor of
      // a dynamic type
      const args = arguments;

      function F() {
        return SubScope.apply(this, args);
      }

      F.prototype = SubScope.prototype;
      const query = new F();

      // Finally, assign the collection property
      query._collection = collection;

      return query;
    }
  }
}

ExpressiveQuery = Query;
