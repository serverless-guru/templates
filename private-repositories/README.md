# Private repositories

Example of how to reference private repositories using SSH for authentication. SSH option is more secure and should be the preferred approach over using HTTPS with token.

## Bitbucket setup

Set up an SSH key and add the public key to your Bitbucket Account settings (steps [here](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/))

> When generating the new SSH key, you should not add a password (leave blank).

## Github setup

Set up an SSH key and add the public key to your Github Account (steps [here](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account))


> When generating the new SSH key, you should not add a password (leave blank).

### package.json repository url refence:

```
"dependencies": {
  "my-private-github-dependency": "git+ssh://git@github.com/org-name/my-private-github-dependency.git#branch",
  "my-private-bitbucket-dependency": "git+ssh://git@bitbucket.org/workspace-name/my-private-bitbucket-dependency.git#branch",
  "my-private-bitbucket-dependency-2": "git+ssh://git@bitbucket.org/workspace-name/my-private-bitbucket-dependency.git#v0.1.0"
}
```
> Note that you can use a specific branch or tag on the dependency url after the `#`.

### CI/CD reference

> Bitbucket pipeline example in [bitbucket-pipelines.yml](https://github.com/serverless-guru/templates/blob/master/private-repositories/bitbucket-pipelines.yml)

```bash

# Install dependencies
apk update
apk add git openssh

# Create .ssh directory
mkdir -p ~/.ssh

# `MY_PRIVATE_DEPLOY_KEY` is an env variable with the ssh private key associated with the public key we added to the Github/Bitbuket account
echo $MY_PRIVATE_DEPLOY_KEY | base64 -d > ~/.ssh/deploy_key
chmod 600 ~/.ssh/deploy_key

# Add bitbucket.org to known hosts to avoid error
ssh-keyscan -t rsa bitbucket.org >> ~/.ssh/known_hosts
# For github.com -> ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

# Start ssh-agent
eval $(ssh-agent)

# Add the key to the ssh-agent
ssh-add ~/.ssh/deploy_key

# Install dependencies
npm install
```