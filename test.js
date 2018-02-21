const assert = require('assert');
Object.freeze(assert);

const {
  createEnumerableProperty,
  createNotEnumerableProperty,
  createProtoMagicObject,
  asyncIncrementor,
  incrementor,
  createIncrementer,
  returnBackInSecond,
  getDeepPropertiesCount,
  createSerializedObject,
  sortByProto,
} = require('./src/index');

describe(('You are awesome, aren\'t you?'), () => {
  it('createEnumerableProperty', async () => {
    const propertyName = 'property';
    const propertyValue = 'value';

    const property = createEnumerableProperty(propertyName);
    const object = {};

    object[property] = propertyValue;

    assert.equal(Object.keys(object).length, 1);
    assert.equal(object[property], propertyValue);
  });

  it('createNotEnumerableProperty', async () => {
    const propertyName = 'property';
    const propertyValue = 'value';

    const property = createNotEnumerableProperty(propertyName);
    const object = {};

    object[property] = propertyValue;

    assert.equal(Object.keys(object).length, 0);
    assert.equal(object[property], propertyValue);
  });

  it('createProtoMagicObject', () => {
    const magicObj = createProtoMagicObject();

    assert.notEqual(typeof magicObj, 'object');
    assert.equal(magicObj.__proto__, magicObj.prototype);
  });

  it('incrementor', () => {
    assert.equal(incrementor()()(), 3);
    assert.equal(incrementor()()()()(), 8);
    assert.equal(incrementor()(), 10);
    assert.equal(incrementor()()()()(), 15);
  });

  it('asyncIncrementor', async () => {
    await asyncIncrementor();
    await asyncIncrementor();
    assert.equal(await asyncIncrementor(), 3);

    await Promise.all([
      asyncIncrementor(),
      asyncIncrementor(),
      asyncIncrementor(),
      asyncIncrementor(),
      asyncIncrementor(),
    ]);

    assert.equal(await asyncIncrementor(), 9);
  });

  it('createIncrementer', () => {
    const inc = createIncrementer();

    assert.equal(inc.next().value, 1);
    assert.equal(inc.next().value, 2);
    assert.equal(inc.next().value, 3);

    let current = 3;
    for (let n of inc) {
      current++;

      assert.equal(current, n);
      if (n > 10) break;
    }
  });

  it('returnBackInSecond', (done) => {
    const param = 'param';

    let check;

    returnBackInSecond(param)
      .then((returnedValue) => {
        check = returnedValue;
      });

    const startTime = Date.now();

    let intervalId = setInterval(() => {
      const currentTime = Date.now();
      const delta = currentTime - startTime;
      if (check === param) {
        clearInterval(intervalId);
        if (delta < 1000 || delta > 1500) {
          assert.equal(true, false);
        } else {
          assert.equal(true, true);
        }
        done();
      } else {
        if (delta > 1500) {
          assert.equal(true, false);
          clearInterval(intervalId);
          done();
        }
      }
    }, 100); 
  });

  it('getDeepPropertiesCount', () => {
    const obj = {};
    let temp = obj;
    for (let i = 0; i < 100; i++) {
      temp[i] = {};
      temp[i][i - 1] = {};
      temp[i][i] = {};
      temp[i][i + 1] = {};

      temp = temp[i][i];
    }

    const count1 = getDeepPropertiesCount(obj);
    assert.equal(count1, 400)

    for (let i = 0; i < 100; i++) {
      temp[i] = {};
      temp[i][i] = {};
      temp[i][i + 1] = {};

      temp = temp[i][i];
    }

    const count2 = getDeepPropertiesCount(obj);
    assert.equal(count2, 700)
  });

  it('createSerializedObject', () => {
    const object = createSerializedObject();

    assert.equal(typeof object, 'object');
    assert.equal(JSON.parse(JSON.stringify(object)), object);
  });

  it('sortByProto', () => {
    const a = {};
    const b = {};
    const c = {};
    const d = {};
    const e = {};
    const f = {};
    const g = {};
    const h = {};

    a.__proto__ = b;
    b.__proto__ = c;
    c.__proto__ = d;
    d.__proto__ = e;
    e.__proto__ = f;
    f.__proto__ = g;
    g.__proto__ = h;
    
    let arr = sortByProto([d, b, h, a]);
    assert.deepEqual(arr, [a, b, d, h]);

    arr = sortByProto([e, c, d, h]);
    assert.deepEqual(arr, [c, d, e, h]);
  });
});
