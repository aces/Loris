## Making a Pull Request

### Preamble

As part of the **open source** community on _**GitHub**_, **_LORIS_** welcomes any contribution to the code issued by collaborators or any other member of the open source community. The following document is meant to aid in **understanding the process** of issuing pull requests to the **_LORIS_** codebase. Following the guidelines below helps streamline the review process and allows for safer and faster release cycles. 

### Definitions

_**GitHub**_ offers several systems for organising _Pull Requests_ and _Issues_. **_LORIS_** uses these systems as defined below.

 - **_Reviewers:_** Members selected for code review of the Pull Request in question.
 - **_Assignees:_** Members selected for manual testing of the Pull Request in question.
 - **_Milestones:_** Target release version for the PR.
 - **_Labels:_** Set of descriptors facilitating processing of a PR.
 - **_Projects:_** Concern oriented grouping of PRs, issues and notes into a single dashboard representing the current state of the specified project.
 - **_Base Branches:_** Descriptors of the nature of the pull request. _Bugfix_, _minor_ or _major_.

### Procedure

_In order for a Pull Request to be processed as quickly as possible, it is crucial for each party involved to fulfill their responsibilities as follows._
> Note that only developers who are members of our GitHub _loristeam_ can add labels and milestones to PRs. 

The tasks below lie with the _**Developer issuing the Pull Request**_:
   1. Choosing the **correct branch** to issue the Pull Request. See [_Choosing Branch and [branch] label_](https://github.com/ridz1208/Loris/wiki/Contributing-to-the-Code#choosing-branch-and-branch-label) section below
   1. Provide a **clear description** for the Pull Request. Following the suggested template is generally the best option.
   1. Adding any necessary **related PRs, tickets or context** documents.
   1. Selecting the **[branch] label** that matches the branch and thus reflects the type of code changes.
   1. Selecting **appropriate labels**. [Labels](Contributing-to-the-Code#understanding-labels-developer-and-repository-manager) are explained in detail below.
   1. When possible **selecting a reviewer**. The best reviewers are the module experts (often suggested automatically on GitHub).

The tasks below lie with the _**Senior Developers and Repository Managers**_:
   1. Confirm choice of **Branch**, **Reviewers** and **Labels**.
   1. Make **suggestions for testers** through comments. Different sections of codes can have different independent testers.
   1. Assign the Pull Request to a **Milestone** to reflect which **LORIS release** it will be in.

## Choosing Branch and _[branch] label_

_Branch and label selection will depend on the type of changes in the code:_

 - **Bug Fixes**
   - Branch: `bugfix`
   - Label: _[branch] bugfix_
   - Content: Generally these changes do not require SQL scripts and are concise with the sole objective to correct on single problem in the code.

 - **Minor Changes** and **Small Features**
   - Branch: `minor`
   - Label: _[branch] minor_
   - Content: Features affecting self-contained components such as modules. Additions to Libraries, API or modules that do not change and function signatures. 

 - **Major Changes**, **Non Backwards-Compatible Changes** and **Large Features**
   - Branch: `major`
   - Label: _[branch] major_
   - Content: Any change modifying a function signature in a library class. Features require extensive LORIS-wide testing. New complex systems and features spanning across multiple modules and libraries. Deprecated functions clean-up.

### Special cases
 
 - When a Pull Request contains **multiple types** of changes, it is suggested to divid the PR into multiple smaller ones when possible and issuing them separately; smaller pull requests are easier to review and tend to contain less of a risk of damage to the remainder of the code.

 - In the event that a Pull Request can not be subdivided into smaller ones, it should be categorized in respect to the **most impacting change** it contains (i.e. a PR containing both bug fixes and minor features would be considered as a minor feature request and would then be issued to the minor branch).

### Considerations

 - **Label-branch Hack:**
   - GitHub page: _Pull Requests_
   - Problem: GitHub does not allow searching or filtering by base branch selected for a PR.
   - Temporary Solution: 3 additional labels created `[branch] bugfix`, `[branch] minor` and `[branch] major` use solely to reflect which branch the Pull Request is going to. Exactly one of these labels should be added on each PR.
   - Conditions for removal: GitHub adding filtering capabilities on repository branches.

## Understanding Labels (_Developer_ and _Repository manager_)

_The following GitHub Labels are designed to be **mutually-exclusive**. The choice of Label should directly reflect the **base branch** the Pull request has been issued to. This label should be modified if base branch is changed under any circumstance._

![](https://via.placeholder.com/15/cc9966/000000?text=+) **[branch] bugfix**

![](https://via.placeholder.com/15/996633/000000?text=+) **[branch] minor**

![](https://via.placeholder.com/15/4d3319/000000?text=+) **[branch] major**

_The following GitHub Labels are designed to be **non mutually-exclusive**. Proper usage of these options facilitates triage, categorization and processing of a PR. Every flag added should have an **associated section in the main description** of the Pull Request justifying the requirement for the aforementioned flag; failure to so can delay the processing of the PR._

![](https://via.placeholder.com/15/66ff66/000000?text=+) **Add to Release Notes**
  - _Description_: PR change should be highlighted in Release notes, such as a key security fix, a new dependency, a new practice enforced by the codebase, or other significant change.  Not always but sometimes overlaps _Feature_ or _Caveat..._ tag.  ([Examples](https://github.com/aces/Loris/pulls?utf8=%E2%9C%93&q=is%3Apr%20-label%3AFeature%20label%3A%22Add%20to%20Release%20Notes%22%20-label%3A%22Caveat%20for%20Existing%20Projects%22%20))

![](https://via.placeholder.com/15/800080/000000?text=+) **API**
  - _Description_: PR introduces Modifications to the API code.

![](https://via.placeholder.com/15/0e8a16/000000?text=+) **Beginner Friendly**
  - _Description_: PR contains changes that can be reviewed or tested by developers new to LORIS. Issue requiring relatively low familiarity with the code to resolve.

![](https://via.placeholder.com/15/000000/000000?text=+) **Blocked**
  - _Description 1_: PR awaiting the merge, resolution or rejection of an other Pull Request.
  - _Description 2_: PR flagged for potential rejection.

![](https://via.placeholder.com/15/f7c6c7/000000?text=+) **Bug Fix**
  - _Description_: PR contains bug fixes (not mutually exclusive with the `Feature` label).

![](https://via.placeholder.com/15/d4c5f9/000000?text=+) **Caveat for Existing Projects**
  - _Description_: PR contains changes that might impact the code or accepted practices of current active projects. Any non backwards-compatible change should have this flag. Any change to library function signatures should have this flag. 

![](https://via.placeholder.com/15/006b75/000000?text=+) **Cleanup**
  - _Description_: PR consists of at least one clean-up operation (could be backwards-compatible or not).

![](https://via.placeholder.com/15/d93f0b/000000?text=+) **Critical to release**
  - _Description_: PR is key for the release to which it has been assigned.

![](https://via.placeholder.com/15/ff99cc/000000?text=+) **Discussion Required**
  - _Description_: PR awaiting the resolution of a discussion between all involved parties. Discussion should occur on the conversation page of the PR. If discussion is done offline, a short summary is expected to appear on the conversation page.

![](https://via.placeholder.com/15/F0FFFF/000000?text=+) **Document at Release**
  - _Description_: PR adds or changes a feature such that the wiki (or other documentation) must be updated.  e.g. new module needs a wiki page, change to install process, imaging pipeline execution changes.  

![](https://via.placeholder.com/15/ffffcc/000000?text=+) **Documentation**
  - _Description_: PR contains modifications to the code documentation including test plans and wikis.

![](https://via.placeholder.com/15/1d76db/000000?text=+) **Feature**
  - _Description_: PR implements at least one new feature (not mutually exclusive with the `Bug Fix` label)

![](https://via.placeholder.com/15/66ccff/000000?text=+) **"Help! I don't understand Travis!"**
  - _Description_: TRAVIS disagrees with PR for mysterious reasons.

![](https://via.placeholder.com/15/DDDDDD/000000?text=+) **Meta**
  - _Description_: PR does something that organizes, upgrades, or manages the functionality of the codebase. ([Examples](https://github.com/aces/Loris/pulls?utf8=%E2%9C%93&q=is%3Apr%20label%3AMeta%20))

![](https://via.placeholder.com/15/ff5050/000000?text=+) **Needs Rebase**
  - _Description 1_: PR issued to the correct branch but contains conflicts with the current state of the target branch. 
  - _Description 2_: PR issued to the wrong branch. 

![](https://via.placeholder.com/15/eb6420/000000?text=+) **Needs Work**
  - _Description_: PR awaiting additional changes by the author or contains issues that the author needs to fix.

![](https://via.placeholder.com/15/09570E/000000?text=+) **Passed Manual Tests**
  - _Description_: PR has undergone proper testing by at least one peer.

![](https://via.placeholder.com/15/bfe5bf/000000?text=+) **SQL**
  - _Description_: PR contains SQL modifications such as schema changes and new SQL scripts.

![](https://via.placeholder.com/15/5319e7/000000?text=+) **Testing**
  - _Description_: PR contains test plan or automated test code (or config files for Travis)

![](https://via.placeholder.com/15/064785/000000?text=+) **UI**
  - _Description_: PR alters or improves the current User Interface.