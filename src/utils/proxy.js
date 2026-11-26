var proxyCache = {};
export function proxy(classname, object, attrs) {
  if (!object) {
    return null;
  }
  if (!(classname in proxyCache)) {
    var properties = [];
    var methods = [];
    var ProxyClass;
    for (let key in object) {
      if (key[0] === '_') {
        continue;
      } else if (typeof object[key] !== 'function') {
        properties.push(key);
      } else if (Object.prototype.hasOwnProperty.call(object, key)) {
        methods.push(key);
      }
    }
    var key = null;
    if (properties.length > 0 || methods.length > 0) {
      ProxyClass = function (object) {
        this._object = object;
        this._objectPrototype = Object.getPrototypeOf(this._object);
        for (var i = 0; i < properties.length; i++) {
          key = properties[i];
          Object.defineProperty(this, key, {
            get() {
              return this._object[key];
            },
            set(value) {
              this._object[key] = value;
            },
          });
        }
      };
    } else {
      ProxyClass = function () {};
    }
    //proxy all the method
    ProxyClass.prototype = Object.create(Object.getPrototypeOf(object));
    ProxyClass.prototype.constructor = ProxyClass;
    ProxyClass.prototype.getWrappedObject = function () {
      return this._object;
    };
    for (let key in Object.getPrototypeOf(object)) {
      if (['constructor'].indexOf(key) < 0 && (!attrs || !(key in attrs))) {
        ProxyClass.prototype[key] = function (...args) {
          return this._objectPrototype[key].apply(this._object, args);
        };
      }
    }

    for (var i = 0; i < methods.length; i++) {
      key = methods[i];
      ProxyClass.prototype[key] = function (...args) {
        return this._object[key]
          ? this._object[key].apply(this._object, args)
          : undefined;
      };
    }

    for (let key in attrs) {
      ProxyClass.prototype[key] = function (...args) {
        return attrs[key].apply(this._object, args);
      };
    }

    ProxyClass.prototype.constructor = ProxyClass;
    proxyCache[classname] = ProxyClass;
  }
  return new proxyCache[classname](object);
}
