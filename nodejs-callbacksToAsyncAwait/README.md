# Videos walking through this project

### Intro
- [Intro to Project](https://www.loom.com/share/702bc6a2640246a986ac1112ee0cc6da)
- [Overview of callbacks vs async await](https://www.loom.com/share/680c982b05c649b0aebee6105902f28a)

### Comparison of Callbacks, Promises, and Async Await
- [Intro](https://www.loom.com/share/da15ed2ca5df460c855398d2a1f7e9e6)
- [Walkthrough](https://www.loom.com/share/57ff7607eb6d4ac2a3328a26b00e718b)

### Refactoring Callbacks to Async Await
- [Intro](https://www.loom.com/share/ade4134d6c454666b898496d85f7cfce)
- [Refactoring Inside Out](https://www.loom.com/share/f880ae556aa84e359963b79d2c4e67a0)
- [Refactoring Outside In](https://www.loom.com/share/6540d38b156849368381925167bf8446)

### Testing
- [Comparison of testing callbacks vs async await](https://www.loom.com/share/23f8cf9b3316418aa36fa41a1b7cd3b4)
- [How to test callbacks](https://www.loom.com/share/4599f06298c441f2a9fbd74729d8e8a7)


# Callbacks to Async Await

There are 3 ways to handle code that takes time, such as aws-sdk calls:
- callbacks
- promises
- async await

In the context of serverless backend lambda functions, we find async await can greatly increase the
readablity of code and help us avoid what is known in the NodeJS communit as 'the pyramid of doom'. 

### What is the pyramid of doom?
If we have 1 step our code with zero aws calls, our code straitforward:

![code with no callbacks](./assets/cb_01.png)

Once we add a callback, you will notice that you end up indenting all further code. The rest of our code
will need the result of the first aws call, so all code will be inside of a callback and will be indented once.

![code with 1 callback](./assets/cb_02.png)

If we have 4 aws calls in our function, we will need to intend 4 times:

![code with 4 callbacks](./assets/cb_03.png)


We also need to make sure we handle potential errors. In the case where there are no callbacks, this is very straightforward:

![code with no callbacks](./assets/cb_e_01.png)

But if we have 1 callback, we need to handle errors at the root level, and errors potentially resulting from the callback.

![code with 1 callback and error handling](./assets/cb_e_02.png)

And if we are errorhandling properly on a function involving 4 callbacks:

![code with 4 callback and error handling](./assets/cb_e_03.png)

This shape we see in the last example is the `pyramid of doom` and it is very common in NodeJS code because traditionally we only had callbacks to work with, and a backend function potentially is interacting with all kinds of resources.

Our code and business logic will probably already have enough necessary indentation from the result of conditional statements like ifs and loops. Thankfully with the maturing of NodeJS, features like promises and async await have made callback indentation avoidable. 

What we would like to see instead would something like this:
![async code with 5 steps](./assets/aa_03.png)


