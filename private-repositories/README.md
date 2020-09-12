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

### Bitbucket pipeline setup reference

#### Steps:

1) Generate a new SSH Key pair in your main repository.
    - In the repository Settings, go to SSH keys under 'Pipelines'.
    - Click "Generate keys" to create a new SSH key pair.
    - Clink "Copy public key" to copy it into your clipboard.

2) Add the public key to the dependency repository.
    - In the repository Settings, go to Access keys under 'General'.
    - Click "Add key" to add the public key you copied in the first step.
    - Add a label and the public key and click "Add SSH Key".

#### Bitbucket pipeline example in [bitbucket-pipelines.yml](https://github.com/serverless-guru/templates/blob/master/private-repositories/bitbucket-pipelines.yml)