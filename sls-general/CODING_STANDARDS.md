# Serverless.yml file
- Avoid hard coding names, stage names, and arns
- Be explicit with what you package for your Lambda function
- No wildcard permissions
- Resources should contain stage in name


# Coding standards
- Keep handler functions small and focused on the high level flow of the lambda function.
- Low level code containing IO or business logic should not be located in handler functions, but in small focused functions with descriptive names
- Function names should be descriptive and avoid abbreviations that sacrifice clarity
- Create helper functions in a helpers folder for reusable functionality like http formatting http responses
- Create an IO folder for all functions that handle interaction with external resources.

# Code Style
- Set a maximum function length
- Set a maximum function indentation depth
- Prefer async await syntax over callbacks
- Avoid using global variables unless absolutely necessary

# Error Handling
- Think about 2 audiences, client (whether thats users or another service) hitting your backend, and developers
- Provide lots of context and details for developers
- Communicate errors appropriatly based on who the client is
