# Expressive Queries for Meteor

Expressive query scopes for meteor's mongo library

## Installation

```meteor add tlr:expressive-queries```

## Preamble

Question: which looks nicer, more re-usable, or more maintainable?

```javascript
var articles = Articles.find({
  categories: {
    $has: 'fun'
  }
  popularity: {
    $gt: 10
  }
}, {
  sort: {
    createdAt: 1
  }
});
```

```javascript
var articles = Articles.EQ()
  .category('fun')
  .popular()
  .latest()
    .results();
```

## Usage

### A Basic ExpressiveQuery Class

Subclass ExpressiveQuery like so:

```javascript
Articles = Mongo.Collection('articles');

class ArticleQuery extends ExpressiveQuery {
  // here, you can add any methods you like that add things to the query property

  // here's a shortcut for showing only items that have been viewed more than 10
  // times
  popular() {
    this.query({
      views: { $gt: 10 }
    });

    return this; // return this for chainability
  }

  // there are other query properties you can change, too. Here, we are changing
  // the sort order
  latest() {
    this.sort({
      createdAt: 1
    });

    return this; // return this for chainability
  }
}

// Finally, bind the query scope to the collection object. This is a non-
// destructive process - it does not interfere directly with mongo or meteor's
// collections. All it does is add two properties to the collection:
//   - Articles.ExpressiveQuery - a property with your class definition,
//   - Articles.Q - a factory function, that you can use to create new queries
//     (see below).
ExpressiveQuery.export(Articles, ArticleQuery);
```

### Executing Queries

You can use these two helpful functions:

```javascript
// Uses the "find" query - ie. returns a mongo cursor object
var articles = Articles.EQ().results();

// Uses the "findOne" query - ie. returns a plain object (or whatever you have
// set transform to output, etc.)
var article = Articles.EQ().result();
```

Or, you can do the query yourself (this is all that happens under the hood in
the above methods):

```javascript
var query = Articles.EQ()

var articles = Articles.find(
    query.selector, query.options
);
```

### Query Functions and Raw values

There are methods for all of the properties of Meteor/mongo searches ([See the meteor docs for `find` and `findOne`](http://docs.meteor.com/#/full/find)):

The first three functions merge the passed in objects to the existing objects:

- `query`  - the query itself
- `sort`   - sorting the results
- `fields` - limit the fields

The rest overwrite any existing values:

- `skip`      - (integer)  How many records to skip
- `limit`     - (integer)  The maximum records to return
- `reactive`  - (boolean)  Whether to return a reactive data set (client only)
- `transform` - (Function) A transforming function that gets applied to all records

```javascript
class ArticleQuery extends ExpressiveQuery {
  convertToClass() {
    this.transform(item => new ArticleClass(item));

    return this;
  }

  topFive() {
    return this
      .sort({ views: 1 })
      .limit(5);
  }
```

### Constructors

You can, of course, require some things in a query scope. In the following example, we add a constructor to the query scope, so that billings can only ever be queried when they belong to a user.

```javascript
class BillingQuery extends ExpressiveQuery {
  constructor(userId) {
    super();

    check(userId, String);

    this.query({userId});
  }

  // ... other methods ...
}

// export it
ExpressiveQuery.export(Billings, BillingQuery);

// any arguments passed to the scope factory will be forwarded to the scope
// constructor
var billings = Billings.EQ(Meteor.userId()).results();
```
