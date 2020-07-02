## Test locally

```
sls logs --stage dev --region us-east-2 -f NotesLambda
```

## Stream logs in real-time

```
sls logs --stage dev --region us-east-2 -f NotesLambda
```

## Grab the last log

```

```

## Invoke Lambda locally

```
sls invoke local -f NotesLambda -b '{}' --stage dev --region us-east-2
```

## Invoke Lambda on AWS

## Print the compiled serverless.yml

```
sls print
```

## Package your serverless deployment locally

