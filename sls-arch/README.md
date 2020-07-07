# Serverless Architecture
WORK IN PROGRESS

## What is included in this pattern?
We go over 2 topics in this pattern:
- Organization Strategies
- Dependency Strategies

The `01_withRequire` project goes over all 3 organization strategies
while defining dependencies with `require`

The `02_withDependencyInjection` project goes over all 3 organization strategies while defining dependencies with `dependency injection` 


## Organization Strategies
There are many ways a project can be organized. In this pattern, we present 3 possible ways, starting with the simplest, and moving towards more complex. The three methods are as follows:

- Method 1: Handler
- Method 2: Handler / Helper
- Method 3: Handler / Helper / Logic

These methods are aimed to solve complexity and code size. When
a service gets larger and painful to manage, moving to the next
method will help manage and organize the size of your project.


### Goal of Strategy
#### Problem:
As a project grows, code becomes hard to read, organize, understand,
and maintain
#### Solution:
The above methods aims to solve these problems when they arise


## Dependency Strategies: Require vs Dependency Injection
Rather than have all our code in 1 file, we often organize
our code into different files. In order for our code to work,
we need to define when fileA needs functionalty from fileB and so on.
This is known as a dependency, fileA depends on fileB because it needs
to use something from that file.

There are 2 general ways we can accomplish this
- Requiring Dependencies
- Injecting Dependencies


