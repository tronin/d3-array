var tape = require("tape"),
    arrays = require("../");

tape("blur() returns a default blur generator", function(test) {
  var h = arrays.blur();
  test.equal(h.radius(), 7);
  test.equal(h.radiusX(), 7);
  test.equal(h.radiusY(), 7);
  test.equal(h.width(), undefined);
  test.equal(h.value(), undefined);
  test.end();
});


tape("blur() blurs in 1D", function(test) {
  var h = arrays.blur();
  test.deepEqual(h.radius(1).width(0)([0, 3, 3, 6, 9, 0, 12, 24]), { 0: 1, 1: 2, 2: 4, 3: 6, 4: 5, 5: 7, 6: 12, 7: 20, width: 8, height: 1 });
  test.end();
});

tape("blur() blurs in 2D", function(test) {
  var h = arrays.blur();
  const i = 3;
  test.deepEqual(h.width(4).radius(1)([
     i, i, i, i,
    -i,-i,-i,-i
  ]), { 0: 1, 1: 1, 2: 1, 3: 1, 4: -1, 5: -1, 6: -1, 7: -1, width: 4, height: 2 });
  test.end();
});

tape("blur().radiusY(0) blurs horizontally", function(test) {
  var h = arrays.blur();
  const i = 3;
  test.deepEqual(h.width(4).radiusX(1).radiusY(0)([
     i, i, i, i,
    -i,-i,-i,-i
  ]), { 0: 3, 1: 3, 2: 3, 3: 3, 4: -3, 5: -3, 6: -3, 7: -3, width: 4, height: 2 });
  test.end();
});

tape("blur().radiusX(0) blurs vertically", function(test) {
  var h = arrays.blur();
  const i = 3;
  test.deepEqual(h.width(2).radiusX(0).radiusY(1)([
     i,-i,
     i,-i,
    -i, i,
    -i, i
  ]), { 0: 3, 1: -3, 2: 1, 3: -1, 4: -1, 5: 1, 6: -3, 7: 3, width: 2, height: 4 });
  test.end();
});

tape("blur().radius() returns the (average) radius", function(test) {
  var h = arrays.blur();
  test.equal(h.width(2).radiusX(1).radiusY(1).radius(), 1);
  test.equal(h.width(2).radius(2).radius(), 2);
  test.equal(h.width(2).radiusX(1).radiusY(5).radius(), 3);
  test.end();
});

