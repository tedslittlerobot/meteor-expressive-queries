
StubCollection = {
  find(selector, options) {
    return {
      name: 'find',
      selector, options
    };
  },
  findOne(selector, options) {
    return {
      name: 'findOne',
      selector, options
    };
  },
};
