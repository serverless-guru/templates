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

#### Bitbucket Steps:
- Create a new user called `CICD` in bitbucket organization.
- Grant access for the required repositories to the above user.
- Generate a new ssh key to be exclusive used for above user.
- Add the new SSH public key to the `CICD` user Account settings. (steps [here](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/))
- [Create a new Repository variable](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/) inside the repo you set up the pipeline.
  - Variable Name: `CICD_SSH_KEY`
  - Variable Value: the private ssh key you created in the step 3.
    - Use this command to copy the key into you clipboard: `pbcopy < ~/.ssh/SSH-KEY-NAME`
    > In the above command, replace `SSH-KEY-NAME` with the name you used when creating the ssh key in the step 3.


#### Bitbucket pipeline example in [bitbucket-pipelines.yml](https://github.com/serverless-guru/templates/blob/master/private-repositories/bitbucket-pipelines.yml)

#### Bash script reference:
```bash

# Install dependencies
apk update
apk add git openssh

# Create .ssh directory
mkdir -p ~/.ssh

# `CICD_SSH_KEY` is an env variable with the ssh key associated with the public key we added to the Bitbuket account
printf "-----BEGIN OPENSSH PRIVATE KEY-----" > ~/.ssh/id_rsa_cicd && printf %s "$CICD_SSH_KEY" | sed -e 's/-----BEGIN OPENSSH PRIVATE KEY-----\(.*\)-----END OPENSSH PRIVATE KEY-----/\1/' | tr ' ' '\n' >> ~/.ssh/id_rsa_cicd && printf "-----END OPENSSH PRIVATE KEY-----\n" >> ~/.ssh/id_rsa_cicd

chmod 600 ~/.ssh/id_rsa_cicd

# Add bitbucket.org to known hosts to avoid error
ssh-keyscan -t rsa bitbucket.org >> ~/.ssh/known_hosts
# For github.com -> ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

# Start ssh-agent
eval $(ssh-agent)

# Add the key to the ssh-agent
ssh-add ~/.ssh/id_rsa_cicd

# Install dependencies
npm install
```