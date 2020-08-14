# LORIS Developers Guide
This document covers topics including making PRs, issues, and how to go through a normal LORIS workflow.

## Links to know, read, and follow
* All markdowns in the Loris GitHub under [docs/](../..) 
* [Contributing.md](../../../CONTRIBUTING.md) - How to contribute to Loris!
* [Coding Standards](../../CodingStandards.md)
* [Pull Request Checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist) and [Code Review guidelines](Code_Review_Guide.md)

## 1. Working off your fork
During installation, you made your own fork of LORIS. Then, you can add two remote options in order to switch between your fork and “aces”.

    git remote rename origin aces
    git remote add myFork <fork-url>
             
Your fork url will usually have the format:  
    `https://github.com/github-username/LORIS`  
    
Any development should be done on your fork of LORIS, and **not** on aces/LORIS. 
Before starting any PR, be mindful of which branch you want to base off of (main vs release-specific branch).   

You will make a different branch for each PR or change that you are making.  

Here is a basic workflow if you are trying to make a PR off of the _main_ branch:

    git fetch aces
    git checkout aces/main 
    git checkout -b "2020-05-06-fixCandidateTestPlan"
    vi filename
    git add filename 
    git status 
    git commit -m "initial commit"
    git push myFork 2020-05-06-fixCandidateTestPlan

There is usually no need to fully update your fork to the newest aces/LORIS version, since you can work off whichever branch you just fetched and checked-out!

 **Never** push to aces/Loris. Your branch will be deleted. Always push to your fork, and then create the PR from GitHub.

**About Branch naming:** Follow the convention most devevelopers use: “date-title...”.   
Starting with the date allows branches to sort and display in order, and also helps sort out any conflicts faster in the main Loris repository.
Don’t forget to make your branch names short and informative, like your commit messages, since they’re read by others on GitHub. 

### Helpful commands to run before pushing new code:
These commands catch small formatting errors that will cause Travis to fail.

    make checkstatic  # includes these 3 commands: 
                      # npm run lint:php, npm run lint:javascript, vendor/bin/phan

    phpcs  modules/candidate_list/php/candidate_list.class.inc
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

### Good practice for Travis
Travis is our continuous integration which runs on every PR in GitHub. As you get more comfortable with commits and PRs, 
to save time and Travis errors, you can configure your setup so that `make checkstatic` must complete successfully 
before any git push can be done. To do this, run 

    git config core.hooksPath .githooks (git v2.9 or up)
    Or 
    cp .githooks/pre-push .git/hooks/pre-push 

in the LORIS directory to configure the project. Make sure `.git/hooks/pre-push` is executable.

**Notes:** Hooks can be skipped with the flag `--no-verify: git push fork --no-verify`.  
Setting up an ssh key can also be useful to avoid the headache of entering your username and password on each push. 

See also: [How to win the love of Travis](https://docs.google.com/presentation/d/1FDYOiyv-2m_nf2JIhJs8YjUCoHjELNyMNrHuqErD6O0/edit#slide=id.p). 
(a 2019 presentation by John Saigle).

## 2. Rebasing
Rebasing is used when there are conflicts between your branch and the branch your PR is based off of (an alternative to merging). 
Here is a general workflow:

    cd /var/www/loris
    git checkout your_branch
    git fetch aces
    git rebase aces/main
    (#) while (conflicts)  { 
        // fix any conflicts!
        git add  filename
        git rebase --continue
    # } loop back to (#) - fix any remaining conflicts.... until no more conflicts
    git push --force your_fork your_branch
    # --force is often needed here :\
       
This is a specific case. For more information on rebasing, look at this [(2014) Git for LORIS cheat document](https://docs.google.com/document/d/1yPx72Z7kJtV3WAcyrwtrMOAtQztzJecVQyaLCJ4jdHg/edit#)!

### Tips for fixing a rebase
1. The most basic way of “fixing” a rebase is to go back to the commit right before the rebase. The easiest way to do this is to either reset or revert to a previous commit. 
For example:
    
       git reset --hard <commit_hash>
       git push -f origin branch-name

2. If you rebase the wrong branch or your PR is displaying all the commits from the branch you rebased and displays multiple commits or changed files that are not part of your PR,
use git cherry-pick. This command allows you to pick specific commits to apply to a branch. Here is an example workflow:  
    ```
    git checkout "your-branch"        #The branch that got messed up :(
    git branch -m "temp-branch-name"  # Change the branch name locally:
                                      # This is a failsafe since you will 
                                      # be changing the history of the 
                                      # branch remotely
    git fetch aces
    git checkout aces/main            # Checkout the branch that your PR is      
                                      # based off of 
    git checkout -b "your-branch"     # Create a “new” branch with the same
                                      # name as the original branch
    git cherry-pick <commit-hash>     # Cherry-pick the commits that you would like to keep
    git push -f origin "your-branch"
    ```
        
## 3. Making a Pull Request
Once you have created a new branch and pushed an initial commit to it, you will see the option to make a pull request on GitHub. 
Make sure that the branch you are merging into is the branch that you checked-out when you first started making changes, such as main or a release-specific branch!

PRs must be reviewed according to this [checklist](https://github.com/aces/Loris/wiki/Code-Review-Checklist), and must be approved by two reviewers before they are merged. Don’t forget to think about documentation updates like the TestPlan, changelog, and developer guide updates -- these must accompany your PR.

Make sure to note special rules for SQL patches. Note that changes to Raisinbread data do not need patches, because Rida manages it.

**Do not** review or approve your own PR. Your PR must be reviewed and approved by two other developers before it can be merged. 

**Important:** Do not merge your own PR or any other PR. After a PR has been reviewed and approved, the code is merged by Dave, the repository maintainer. It will be merged eventually. If your PR is on a release branch and has been ready to merge for a few days, you can add a comment that it is ready to merge. 

It is your responsibility to be on top of your PRs and any Issues that need follow-up.  This includes answering questions and comments, acknowledging and making change requests, and requesting re-review after you’ve addressed someone’s change requests. 

This is important for the Team’s productivity -- it prevents PRs from lagging and prevents confusion as to why a PR has stalled or if you’ve seen someone’s comments.
When issuing a PR, you can request a specific reviewer (this is not the same as assigning a PR to someone).  There is usually an obvious reviewer for a PR.  
This is especially important in Release-Test/Fix cycles when we want PRs to be reviewed and resolved quickly.

### PR Formatting
Be sure to observe and follow team conventions for how PRs should be named and described. 

**Title:** [module_name] Quick description   

**[Contents](../../../.github/PULL_REQUEST_TEMPLATE.md) of the initial comment:** Include a brief summary of the changes and rationale, links to related issues or PRs, and testing instructions if there are any. 

**Linking issues:** Use GitHub keywords like `Fixes` or `Resolves` so that related issues are closed automatically when the PR is merged. Do not use these key words if you are only addressing one point raised in an issue. This will close the entire issue and leave unresolved bugs.
**Note** that automatic issue-linking and issue-closing only works on the default branch.  If the PR is not on the default branch, you will need to manually close the issue after the PR is merged. 

**Labels:** On the right side of the browser, you will see the option to add labels. Please add any that are related to the PR. 
**If** you are working on release testing, make sure to include the label (ex. 23.0.0-testing) to the PR.

**Reviewers/Assignees:** Reviewers are people that you would like to ping specifically, but are not the same as assignees.
Be sure to consult the Contributing and Code Review guidelines. For example, 2 reviewers must approve the PR and any code change must be pulled and tested by a developer before a PR is marked as `Passed Manual Tests`. 

**Travis:** The Travis build status and results are linked near the bottom of your PR in GitHub. 
You can restart Travis if it gives error messages that seem inappropriate, or if the build stalls (for longer than 1h).
if you are pushing a last typo fix on a PR, it is okay to add `[skip ci]` in the commit message. It is not okay to do this if it's the first commit or if you are fixing more than documentation typos.

**Documentation PRs:** If working specifically on markdown files or other documentation, be sure to check the actual look of the document once you have pushed your PR and fix any formatting errors. You can do this by going to “Files Changed” and viewing how your markdown file will actually appear in GitHub. Don’t forget to click all links. 

## 4. Issues
Every PR should have a related issue that it is fixing. If you are going to be making a 
change, make an issue for it and assign yourself to be the one to fix it!

When you make an issue, there are 4 options: bug fix, feature request, security 
vulnerability, or a blank format. You will probably either be making a bug fix or feature 
request. In these cases, there will be a format to follow.

Be sure to observe and follow conventions for how Issues should be named and described and how to ping other people for input.
 
Generally we do not assign issues. If someone seems like an obvious candidate to take on an issue, bring their attention to it via slack, and they will self-assign if they feel appropriate.  

Don’t just follow the template blindly. For example, remove the “Brief summary of issue” header and put your summary of the issue there.   
Don’t leave obvious template words like “(if applicable)” in your issue!

## 5. Code Review

### Testing or Contributing to someone's PR
First, make a remote of their fork:

    git remote add "remote-name" "their-fork-url"
          
Then, fetch their remote fork and checkout the branch related to their PR:

    git fetch remote_name
    git checkout remote_name/branch

Alternatively, to avoid being under the detached HEAD state, checkout and create a local branch with the command

    git checkout -b branch remote/branch

Follow the provided testing instructions to test their code on your VM. 

If you made changes (with their permission), commit and push them to that branch:

    git commit -m "Changes made"
    git push remote_name branch

Don’t forget to consult the Links (see above) for coding review standards and guidelines and the code review checklist.

### Labels
The `Passed Manual Tests` label can be added to a PR if you have tested the code on your own VM and determined that it performs as intended.

The `Needs Rebase` label can be added if a PR has merge conflicts with the branch it is based off of.

The `Needs Work` label can be added if a PR is not yet ready for review and requires more work before it can be approved.

Other Labels can also be added by reviewers at their discretion. 

### Code Review Etiquette
The most important thing to remember during code review is to be respectful and positive in all correspondence with other developers. It is also good practice
to be on top of all comments or requests and to respond to every comment.

#### When to ask for or remind someone to do a review
You may ask for someone to review your PR at your discretion. However, do not assign someone to your PR.

In general, if someone has previously reviewed your PR and requested changes, it is good practice to re-request their review once you have implemented those changes.

If you have requested review on a PR and have not received feedback for a number of days, it is okay to either re-request their review or leave a comment
on the PR pinging the developer with a short message. For example, "Hey @developer, could you please review this PR and let me know what you think!"

#### Implementing suggestions or requested changes
It is good practice to implement any requested changes as soon as possible and then re-request review from the developer. It is also recommended
that you acknowledge a reviewer's suggestion or request, either by responding to it with a short "I'm on it!"-type message or by leaving an emoji.

If you feel that the suggested or requested change is not necessary, feel free to respond in the comment section with a clear explanation of why you don't think it is necessary.
Make sure to stay positive and respectful in all review or comment threads!

#### When to resolve a review or comment thread
If you have implemented a requested change from a review-comment thread, it is good practice to let the developer who requested the change
resolve the thread. However, if a comment thread is simple or straightforward and has been resolved, feel free to resolve it.

If there is context discussed in a review-comment thread that people may want to consult later, don't resolve the comment thread. You can simply put an emoji and add a comment saying "Thanks" or "Change made" to signal that the review has been addressed.

## 6. Accessing a Database
To access the database, use the following command, using the credentials given to you:  
```
mysql -u user -h host database -p
```
and provide the password on prompt.

To preview very large tables, use `\G` instead of `;` at the end of a query. This formats the query output nicely, so that you can read through it easier. 
