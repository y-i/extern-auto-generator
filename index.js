const listAllProperty = (obj) => {
    let propNames = [];
    for (; obj; obj = Object.getPrototypeOf(obj)) {
        propNames = propNames.concat(Object.getOwnPropertyNames(obj));
    }
    return propNames;
};

let defaultProperty = {};
defaultProperty["undefined"] = listAllProperty(undefined);
defaultProperty["null"] = listAllProperty(null);
defaultProperty["boolean"] = listAllProperty(new Boolean());
defaultProperty["number"] = listAllProperty(new Number());
defaultProperty["string"] = listAllProperty(new String());
defaultProperty["symbol"] = listAllProperty(Symbol());
defaultProperty["function"] = listAllProperty(new Function());
defaultProperty["object"] = listAllProperty(new Object());

// list all properties which are added by the library
const listAddedProperty = (newArray, defaultArray) => {
    return newArray.filter((value) => {
        return defaultArray.indexOf(value) === -1;
    });
};

const listAllExterns = (obj, name = 'ObjName') => {
    const externs = [];
    const type = typeof obj;
    const props = listAddedProperty(Object.keys(obj), defaultProperty[type]);
    const pushProperty = (name, elem, value) => {
        let left;
        // if the name is invalid in dot notation
        if (elem.match(/^[0-9]+$/) || elem.match(/[ \.]/) || elem.length === 1) {
            left = `${name}["${elem}"]`;
        } else {
            left = `${name}.${elem}`;
        }
        externs.push(`${left} = ${value}`);
    };
    for (const elem of props) {
      if (typeof obj[elem] === "function") {
        try {
            pushProperty(name, elem, `function(${obj[elem].toString().match(/^(function\s[a-z]?)?\(([^\(\)]*)\)/)[2]}) {}`);
        } catch (e) {
            pushProperty(name, elem, `function() {}`);
        }
        if (elem.match(/^[0-9]+$/) || elem.match(/[ \.]/) || elem.length === 1) {
            externs.push(...listAllExterns(obj[elem], `${name}["${elem}"]`));
        } else {
            externs.push(...listAllExterns(obj[elem], `${name}.${elem}`));
        }
      } else if (obj[elem] === null) {
        pushProperty(name, elem, `true`);
      } else if (Array.isArray(obj[elem])) {
        pushProperty(name, elem, `[]`);
      } else if (typeof obj[elem] === "object") {
        if (elem.match(/^[0-9]+$/) || elem.match(/[ \.]/) || elem.length === 1) {
            externs.push(...listAllExterns(obj[elem], `${name}["${elem}"]`));
        } else {
            externs.push(...listAllExterns(obj[elem], `${name}.${elem}`));
        }
      } else {
        pushProperty(name, elem, `true`);
      }
    }

    return externs;
};
