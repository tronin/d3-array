var tape = require("tape"),
    arrays = require("../");

tape("blur() returns a default blur generator", function(test) {
  var h = arrays.blur();
  test.equal(h.radius(), 5);
  test.equal(h.width(), undefined);
  test.equal(h.iterations(), 3);
  test.equal(h.value(), undefined);
  test.equal(h.direction(), undefined);
  test.end();
});


tape("blur() blurs in 1D", function(test) {
  var h = arrays.blur();
  test.deepEqual(h.radius(1).iterations(1).width(0)([0, 3, 3, 6, 9, 0, 12, 24]), { 0: 1, 1: 2, 2: 4, 3: 6, 4: 5, 5: 7, 6: 12, 7: 20, width: 8, height: 1 });
  test.end();
});

tape("blur() blurs in 2D", function(test) {
  var h = arrays.blur();
  const i = 1331;
  test.deepEqual(h.width(4)([
     i, i, i, i,
    -i,-i,-i,-i
  ]), { 0: 1, 1: 1, 2: 1, 3: 1, 4: -1, 5: -1, 6: -1, 7: -1, width: 4, height: 2 });
  test.end();
});

