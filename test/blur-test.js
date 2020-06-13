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
  test.deepEqual(h.radius(1).iterations(1).width(0)([0, 1, 2, 3, 10, 2, 12, 25]), { 0: 0.5, 1: 1, 2: 2, 3: 5, 4: 5, 5: 8, 6: 13, 7: 18.5, width: 8, height: 1 });
  test.end();
});

tape("blur() blurs in 2D", function(test) {
  var h = arrays.blur();
  test.deepEqual(h.width(4)([0, 1, 2, 3, 8, 10, 12, 27]), { 0: 7.875, 1: 7.875, 2: 7.875, 3: 7.875, 4: 7.875, 5: 7.875, 6: 7.875, 7: 7.875, width: 4, height: 2 });
  test.end();
});

