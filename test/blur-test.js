const tape = require("tape"),
    arrays = require("../");

tape("blur() returns a default blur generator", function(test) {
  const h = arrays.blur();
  test.equal(h.radius(), 5);
  test.equal(h.radiusX(), 5);
  test.equal(h.radiusY(), 5);
  test.equal(h.width(), undefined);
  test.equal(h.value(), undefined);
  test.end();
});


tape("blur() blurs in 1D", function(test) {
  const h = arrays.blur();
  test.deepEqual(
    h.radius(1).width(0)([0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0]),
    Object.assign([0, 0, 0, 1, 3, 6, 7, 6, 3, 1, 0, 0, 0, 0], { width: 14, height: 1 })
  );
  test.end();
});

tape("blur() blurs in 2D", function(test) {
  const h = arrays.blur();
  test.deepEqual(
    h.width(4).radiusX(1).radiusY(1)([0, 0, 0, 0, 729, 0, 0, 0, 0, 0, 0, 0]),
    Object.assign([117, 81, 36, 9, 117, 81, 36, 9, 117, 81, 36, 9], { width: 4, height: 3 })
  );
  test.end();
});

tape("blur().radiusY(0) blurs horizontally", function(test) {
  const h = arrays.blur();
  test.deepEqual(
    h.width(4).radiusX(1).radiusY(0)([27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    Object.assign([13, 9, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0], { width: 4, height: 3 })
  );
  test.end();
});

tape("blur().radiusX(0) blurs vertically", function(test) {
  const h = arrays.blur();
  test.deepEqual(
    h.width(4).radiusX(0).radiusY(1)([0, 0, 0, 27, 3, -9, 0, 0, 0, 0, 0, 0]),
    Object.assign([1, -3, 0, 13, 1, -3, 0, 9, 1, -3, 0, 5], { width: 4, height: 3 })
  );
  test.end();
});

tape("blur().radius(0.5) does a fraction of blur", function(test) {
  const h = arrays.blur().width(5), V = [0,0,0,0,0, 0,0,5184,0,0, 0,0,0,0,0];
  test.deepEqual(
    h.radius(0.5)(V),
    Object.assign([91, 357, 616, 357, 91, 130, 510, 880, 510, 130, 91, 357, 616, 357, 91], { width: 5,  height: 3 })
  );
  test.end();
});


tape("blur().radius() returns the (average) radius", function(test) {
  const h = arrays.blur();
  test.equal(h.width(2).radiusX(1).radiusY(1).radius(), 1);
  test.equal(h.width(2).radius(2).radius(), 2);
  test.equal(h.width(2).radiusX(1).radiusY(5).radius(), 3);
  test.end();
});

