# Avoid Nested Checks

Instead of checking if things are ok, and remembering to deal with the else afterwards:
```js
if (somethingIsOk) {
    if (anotherThingIsOk) {
        if (finalThingIsOk) {
            resolve('success')
        } else {
            reject('finalFailure')
        }
    } else {
        reject('anotherFailure')
    }
} else {
    reject('failure')
}
```

Check if things are not ok, enabling you to avoid over nesting, and having to write an else statement
```js
if (somethingIsNotOk) {
    reject('failure')
}

if (anotherThingIsNotOk) {
    reject('anotherFailure')
}

if (finalThingIsNotOk) {
    reject('finalFailure')
}

resolve('success')

```
