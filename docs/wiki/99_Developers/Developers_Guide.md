# LORIS Developers Guide
This document covers topics including making PRs, issues, and how to go through a normal LORIS workflow when contributing to the LORIS repository. Many notes in this guide are also relevant to contributing code on a fork or instance of LORIS, and many practices described here will be familiar to experienced developers.

## Key Links
Important standards and practices documented in our repo include:  

* [Contributing.md](../../../CONTRIBUTING.md) - How to contribute to Loris  

* [Coding Standards](../../CodingStandards.md)  

* [Pull Request Checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist) and [Code Review guidelines](Code_Review_Guide.md)

## 1. Working off your fork
During installation, you made your own fork of LORIS. Now you can add two remote options in order to switch between your fork and “aces”.

    git remote rename origin aces
    git remote add my_fork <fork_url>
             
Your fork url will usually have the format:  
    `https://github.com/github-username/LORIS`  
    
Any development should be done on your fork of LORIS, and **not** on aces/LORIS. 
Before starting any PR, be mindful of which branch you want to base off of (main vs release-specific branch).   

You will make a different branch for each PR or change that you are making.  

In general, smaller pull requests or changes are easier to work with in our team review context and will flow more smoothly through the review process.  

Here is a basic workflow if you are trying to make a PR off of the _main_ branch:

    git fetch aces
    git checkout aces/main 
    git checkout -b "branch_name"
    vi filename
    git add filename 
    git status 
    git commit -m "Initial commit"
    git push my_fork branch_name

There is usually no need to fully update your fork to the newest aces/LORIS version, since you can work off whichever branch you just fetched and checked-out.

 **Never** push to aces/Loris. Your branch will be deleted. Always push to your fork, and then create the PR from GitHub.

#### Branch Naming
Many LORIS developers follow the convention: “date-title...”.   
Starting with the date allows branches to sort and display in order, and also helps sort out any conflicts faster in the main Loris repository. Please keep branch names short and informative.

#### Development Mode
To activate the development mode, turn sandbox to 1 in the `project/config.xml` file:
```
<dev>
    <sandbox>1</sandbox>
</dev>
```
And then re-compile:
```
npm run compile
```
This will change several configurations in your LORIS project to allow for more verbose error reporting, which is useful for debugging.

### Helpful commands to run before pushing new code:
GitHub Actions is our continuous integration suite which runs on every PR in GitHub. These commands can catch small formatting errors that will cause the GitHub Actions build to fail.

    make checkstatic  # includes these 3 commands: 
                      # npm run lint:php, npm run lint:js, vendor/bin/phan

    vendor/bin/phpcs --standard=test/LorisCS.xml modules/candidate_list/php/candidate_list.class.inc
                      # phpcs allows you to specifically check the formatting of one file 

    vendor/bin/phpcbf --standard=test/LorisCS.xml modules/candidate_list/php/candidate_list.class.inc
                      # phpcbf allows you to automatically fix the errors 
                      # found by phpcs marked with a check.

Running unit or integration tests (useful if making significant changes to any module). More details can be found [here](../../../test/README.md):
         
    npm run tests:unit
    # The commands below allow you to run unit tests for a specific 
    # module or a specific test in a module
    npm run tests:unit -- --filter CandidateTest
    npm run tests:unit -- --filter CandidateTest::someTest
    npm run tests:integration

### Good practice for GitHub Actions
As you get more comfortable with commits and PRs, to save time and GitHub Actions errors you can configure your setup so that `make checkstatic` must complete successfully 
before any git push can be done. To do this, run 

    git config core.hooksPath .githooks (git v2.9 or up)
    Or 
    cp .githooks/pre-push .git/hooks/pre-push 

in the LORIS directory to configure the project. Make sure `.git/hooks/pre-push` is executable.

**Note:** Hooks can be skipped with the flag `--no-verify`. ie. `git push fork --no-verify`.  
Setting up an ssh key can also be useful to avoid the headache of entering your username and password on each push. 

## 2. Issues
Issues are used to bring the team's attention to any bugs or feature requests that you come across. When you make an issue, there are 4 options: bug fix, feature request, security vulnerability, or a blank format. You will probably either be making a bug fix or feature request. In these cases, there will be a template to fill out.

Every PR should have a related issue that it is fixing. If you are going to be making a 
change, make an issue for it and assign yourself to be the one to fix it.

Be sure to observe and follow conventions for how Issues should be named and described and how to ping other people for input.
 
Our team tends to self-assign issues. If you would like to take on a non-trivial issue, please ask us for input early and often.

Don’t just follow the template blindly. For example, remove the “Brief summary of issue” header and put your summary of the issue there.
Don’t leave obvious template words like “(if applicable)” in your issue.
        
## 3. Pull Requests
Once you have created a new branch and pushed an initial commit to it, you will see the option to make a pull request on GitHub. 
Make sure that the branch you are merging into is the branch that you checked-out when you first started making changes, such as main or a release-specific branch.

PRs must be reviewed according to this [checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist), and must be approved by two reviewers before they are merged. Don’t forget to think about documentation updates like the TestPlan, changelog, and developer guide updates -- these must accompany your PR.

Make sure to note special rules for SQL patches. Note that changes to Raisinbread data do not need patches, because RaisinBread is maintained by sourcing the project patches.

**Important:** Do not merge your own PR or any other PR. After a PR has been reviewed and approved by a senior member of the LORIS team, it will be merged eventually. If your PR is on a release branch and has been ready to merge for a few days, you can add a comment that it is ready to merge. 

It is your responsibility to be on top of your PRs and any Issues that need follow-up.  This includes answering questions and comments, acknowledging and making change requests, and requesting re-review after you’ve addressed someone’s change requests. 
This is important for the developer team’s productivity -- it prevents PRs from lagging and prevents confusion as to why a PR has stalled or if you’ve seen someone’s comments.
When issuing a PR, you can request a specific reviewer (this is not the same as assigning a PR to someone) if you know you would like someone in particular to review a PR. 
This is especially important in Release-Test/Fix cycles when we want PRs to be reviewed and resolved quickly.

### PR Formatting
Be sure to observe and follow team conventions for how PRs should be named and described. 

**Title:** [module_name] Quick description   

**[Contents](https://github.com/aces/Loris/blob/main/.github/PULL_REQUEST_TEMPLATE.md) of the initial comment:** Include a brief summary of the changes and rationale, links to related issues or PRs, and testing instructions if there are any. 

**Linking issues:** Use GitHub keywords like `Fixes` or `Resolves` so that related issues are closed automatically when the PR is merged. Do not use these keywords if you are only addressing one point raised in an issue. This will close the entire issue and leave unresolved bugs in the codebase.
**Note** that automatic issue-linking and issue-closing only works on the default (main) branch.  If the PR is not on the default branch, you will need to manually close the issue after the PR is merged. 

**Labels:** On the right side of the browser, you will see the option to add labels. Please add any that are related to the PR. 
**If** you are working on release testing, make sure to include the label (ex. 23.0.0-testing) to the PR.

**Reviewers/Assignees:** Reviewers are people that you would like to ping specifically, but are not the same as assignees.
Be sure to consult the Contributing and Code Review guidelines. For example, 2 reviewers must approve the PR and any code change must be pulled and tested by a developer before a PR is marked as `Passed Manual Tests`. 

**GitHub Actions:** The GitHub Actions build status and results are linked near the bottom of your PR in GitHub. 
You can restart GitHub Actions if it gives error messages that seem inappropriate, or if the build stalls (for longer than 1h).

**Documentation PRs:** If working specifically on markdown files or other documentation, be sure to check the actual look of the document once you have pushed your PR and fix any formatting errors. You can do this by going to “Files Changed” and viewing how your markdown file will actually appear in GitHub. Don’t forget to click all links to make sure they won't be broken when the document is rendered. 

## 4. Code Review

### Testing or Contributing to someone's PR
First, make a remote of their fork:

    git remote add "their_fork" <their_fork_url>
          
Then, fetch their remote fork and checkout the branch related to their PR:

    git fetch their_fork
    git checkout their_fork/branch_name

Alternatively, to avoid being under the detached HEAD state, checkout and create a local branch with the command

    git fetch their_fork
    git checkout -b branch their_fork/branch_name

Follow the provided testing instructions to test their code on your VM. 

If you made changes (with their permission), you can commit and push them to that branch. Note that you will most likely need to be given permission on GitHub by 
the developer to push changes to their branch.

    git commit -m "Changes made"
    git push their_fork branch_name

Don’t forget to consult the Links (see above) for coding review standards and guidelines and the code review checklist.

### Labels
The `Passed Manual Tests` label can be added to a PR if a reviewer has tested the code on their own VM and determined that it performs as intended.

The `Needs Rebase` label can be added if a PR has merge conflicts with the branch it is based off of.

The `Needs Work` label can be added if a PR is not yet ready for review and requires more work before it can be approved.

Other Labels can also be added by reviewers at their discretion. 

## 5. Rebasing
Rebasing is used when there are conflicts between your branch and the branch your PR is based off of (an alternative to merging). 
Here is a general workflow:

    cd /var/www/loris
    git checkout branch_name
    git fetch aces
    git rebase aces/main
    (#) while (conflicts)  { 
        // fix any conflicts and add any files
        git add  filename
        git rebase --continue
        // OR you can "skip" specific changes
        git rebase --skip
    # } loop back to (#) - fix any remaining conflicts.... until no more conflicts
    git push --force-with-lease my_fork branch_name

### Fixing a rebase gone wrong
1. The most basic way of “fixing” a rebase gone wrong is to go back to the commit right before the rebase. The easiest way to do this is to either reset or revert to a previous commit. **Note** that this is a potentially destructive command, so be very cautious when using it. It is also recommended that you make a backup of your branch before performing these commands so that you don't lose any changes. 
For example:   
    ```
    git reset --hard <commit_hash>
    git push --force-with-lease my_fork branch_name
    ```   

2. A more complicated tool that can be used to solve bigger rebasing errors is the command [`git cherry-pick`](https://git-scm.com/docs/git-cherry-pick). This command allows you to pick specific commits to apply to a branch. For example, if you rebase the wrong branch or your PR is incorrectly displaying all the commits or files from the branch you rebased, this tool will come in handy. Here is an example workflow:   
    ```
    git checkout branch_name          # The branch that got messed up :(
    git branch -m "temp_branch_name"  # Change the branch name locally:
                                      # This is a failsafe since you will
                                      # be changing the history of the
                                      # branch remotely
    git fetch aces
    git checkout aces/main            # Checkout the branch that your PR is
                                      # based off of
    git checkout -b "branch_name"     # Create a “new” branch with the same
                                      # name as the original branch
    git cherry-pick <commit-hash>     # Cherry-pick the commits that you would like to keep
    git push --force-with-lease my_fork "branch_name"
    ```

## 6. Accessing a Database
To access the database, use the following command, using the credentials given to you:  
```
mysql -u user -h host database -p
```
and provide the password on prompt.

If you are new to the MySQL commandline, try using `\G` instead of `;` at the end of a query - this will print one column value per line, which makes the query output easier to read.
