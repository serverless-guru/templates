var Git = require("nodegit");
var fs = require("fs");
var promisify = require("promisify-node");
var fs_extra = require("fs-extra");
var fse = promisify(fs_extra);
fse.ensureDir = promisify(fse.ensureDir);

const BITBUCKET_USERNAME = process.env.BITBUCKET_USERNAME;
const BITBUCKET_TOKEN = process.env.BITBUCKET_TOKEN;
const BITBUCKET_ORG_OR_USERNAME = process.env.BITBUCKET_ORG_OR_USERNAME;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG_OR_USERNAME = process.env.GITHUB_ORG_OR_USERNAME;

exports.handler = async event => {

    let body = JSON.parse(event.body);
    console.log(JSON.stringify(body, null, 2));
    let commitName = body.push.changes[0].new.target.author.user.display_name;
    let commitMessage = body.push.changes[0].new.target.message;
    let rawEmail = body.push.changes[0].new.target.author.raw;
    let commitEmail = rawEmail.substring(rawEmail.lastIndexOf("<") + 1, rawEmail.lastIndexOf(">")); // John Doe <johndoe@gmail.com>

    let branchName = body.push.changes[0].new.name;
    let repoName = body.repository.name;
    let githubURL = `https://github.com/${GITHUB_ORG_OR_USERNAME}/${repoName}.git`;
    let bitbucketURL = `https://${BITBUCKET_USERNAME}@bitbucket.org/${BITBUCKET_ORG_OR_USERNAME}/${repoName}.git`;
    let directoryWhereCodeIsCloned = "/tmp/repositories";
    let fullPathToClonedCode = `${directoryWhereCodeIsCloned}/${repoName}`;

    console.log({
        commitName,
        commitMessage,
        rawEmail,
        commitEmail,
        branchName,
        repoName,
        githubURL,
        bitbucketURL,
        directoryWhereCodeIsCloned,
        fullPathToClonedCode,
        BITBUCKET_USERNAME,
        BITBUCKET_ORG_OR_USERNAME,
        GITHUB_USERNAME,
        GITHUB_ORG_OR_USERNAME
    })

    try {
        //The github options
        let opts = {
            fetchOpts: {
                callbacks: {
                    // needed to fix SSL Cert issue
                    certificateCheck: () => { 
                        console.log("In certificateCheck") 
                        return 1;  
                    },  
                    credentials: () => {
                        console.log("In credential") 
                        return Git.Cred.userpassPlaintextNew(BITBUCKET_USERNAME, BITBUCKET_TOKEN);
                    }
                }
            }
        };

        //Clone the repository
        if(fs.existsSync(directoryWhereCodeIsCloned)) {
            console.log('/tmp/repositories exists');
            await fse.removeSync(directoryWhereCodeIsCloned); 
        }

        await Git.Clone(bitbucketURL, fullPathToClonedCode, opts);

        let repo = await Git.Repository.open(fullPathToClonedCode);
        let index = await repo.refreshIndex();
        await index.write();
        let oid = await index.writeTree();
        console.log('oid', oid);
        let head = await Git.Reference.nameToId(repo, "HEAD");
        console.log('head', head);
        let parent = await repo.getCommit(head);
        console.log('parent', parent);
        let author = await Git.Signature.create(commitName, commitEmail, Date.now(), 60);
        let committer = Git.Signature.create(commitName, commitEmail, Date.now(), 90);
        let commitResult = await repo.createCommit("HEAD", author, committer, commitMessage, oid, [parent]);
        console.log('commitResult', commitResult);
        let remote = await Git.Remote.createAnonymous(repo, githubURL);
        let lastCommit = await repo.getHeadCommit();
        try {
            let getBranchResult = await repo.getBranch(branchName);
            console.log('getBranchResult', getBranchResult);
        } catch (error) {
            console.log('error getting branch, creating branch');
            let createBranchResult = await repo.createBranch(branchName, lastCommit, 0);
            console.log('createBranchResult', createBranchResult);
        }
        let pushResult = await remote.push(
            // TODO: make branch dynamic
            [`+refs/heads/${branchName}:refs/heads/${branchName}`],
            {
                callbacks: {
                    // needed to fix SSL Cert issue
                    certificateCheck: () => { 
                        console.log("In certificateCheck") 
                        return 1;  
                    },  
                    credentials: () => {
                        console.log("In credential") 
                        return Git.Cred.userpassPlaintextNew(GITHUB_USERNAME, GITHUB_TOKEN);
                    }
                }
            },
            true /* ignoreCertErrors */
        );
        console.log('Sync to GitHub was successful');
        return {
            statusCode: 200,
            body: 'Sync to GitHub was successful'
        }
    } catch(error) {
        console.log('something went wrong', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error)
        }
    }
};