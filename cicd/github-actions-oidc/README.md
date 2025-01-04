These templates show an example of how to authenticate against AWS using Open ID Connect (OIDC) and deploy/destroy a stack

For more info on how to configure your AWS account, read [this blog post](https://benoitboure.com/securely-access-your-aws-resources-from-github-actions).


# How/when to use

Use [deploy.yml](./deploy.yml), to deploy branch/ephemera stacks on every pull request, or to staging/prod environments when you merge to develop or main.

Use [teardown.yml](./teardown.yml) to tear down an ephemeral stack when the branch is merged.

Both files shoud be palced in the `.github/workflows/` dorectoy of your repository.

# Tips

When deploying ephemeral/branch stacks, you can also use them to run integration tests. See [sls-jest](https://serverlessguru.gitbook.io/sls-jest/).
