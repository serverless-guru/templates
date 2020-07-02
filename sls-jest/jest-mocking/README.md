# Mocking Examples

Currently there are 2 strategies covered in this project:
1. Mocking a module inside the test file using `jest.fn().mock` or `jest.mockImplementation`
2. Mocking a module automatically with a `__mocks__` folder

## Mocking inside a test folder
This is a nice way to mock functions or modules without having to change or add anything to your source code. In the `/01_jestFn`
folder, we have the following scenarios demonstrated:
- `/01_jestFn/01_moduleExport` demonstrates how to mock a function that is exported as a module
- `/01_jestFn/02_moduleFunction` demonstrates how to mock a function that is exported as a method on the module
- `/01_jestFn/03_moduleExportClass` demonstrates how to mock a class that is exported as a module
- `/01_jestFn/04_moduleFunctionClass` demonstrates how to mock a class that is exported as a method on the module

## Mocking automatically by creating mocks inside a `__mocks__` folder
This is great if you want modules to be automatically mocked the same way in all your tests. This requires that you make a
`__mocks__` folder alongside all your modules. Example:
```
/io
  /db
    __mocks__
      db.js
    db.js
  /ses
    __mocks__
      ses.js
    ses.js
index.js    
```
We have the following scenarios demonstrated:
- `/02_mockFolder/01_moduleExport` demonstrates how to mock a function that is exported as a module
- `/02_mockFolder/02_moduleFunction` demonstrates how to mock a function that is exported as a method on the module
- `/02_mockFolder/03_moduleExportClass` demonstrates how to mock a class that is exported as a module
- `/02_mockFolder/04_moduleFunctionClass` demonstrates how to mock a class that is exported as a method on the module
