### Serverless Orchestration Workflows with AWS Step Functions using Serverless Framework

In this template, we demonstrate below AWS services:
- AWS Step Functions
- AWS Lambda

Use Cases Covered:
- Serverless multiple Lambda orchestration workflow with AWS Step Functions

### This Serverless Framework template IaC will create
- 1 State Machine with Standard type Workflow with different states e.g Choice, Task, etc.
- 4 Lambda Functions (add, subtract, multiply, validateResult)

### This POC Demo Step Function standard workflow works like this
1. Step Function workflow Start with Choice state

2. Based on choice states 'operation' input, do call different steps of lambda tasks e.g add, subtract, multiply

3. add, subtract, multiply tasks lambda step will call 'validateResult' lambda task

4. 'validateResult' lambda task checks this

- 4.1. From add, subtract, multiply step 'resultNumber' > 100 then raise exception 'NumberIsBig' which will catch by 'NumberIsBig' fail step
- 4.2. Incase 'resultNumber' not valid then return 'InvalidNumberError' exception
- 4.3. resultNumber < 0 will raise exception with timeout
- 4.4. For other success scenario it will return success 'resultNumber'

### Steps Functions State Machine Execution Cases

1. Case - add - Succeeded
    1. Input JSON Value: { "number1": 5, "number2": 2, "operation": "add" }
    2. Result Success ["output": 7]
    
2. Case - add - Failed
    1. Input JSON Value: { "number1": 99, "number2": 2, "operation": "add" }
    2. Result Failed [output resultNumber > 100]
    
3. Case - subtract - Succeeded
    1. Input JSON Value: { "number1": 5, "number2": 2, "operation": "subtract" }
    2. Result Success ["output": 3]    
    
4. Case - multiply - Succeeded
    1. Input JSON Value: { "number1": 5, "number2": 2, "operation": "multiply" }
    2. Result Success ["output": 10]
    
5. Case - multiply - Failed
    1. Input JSON Value: { "number1": 15, "number2": 7, "operation": "multiply" }
    2. Result Failed [output resultNumber > 100]