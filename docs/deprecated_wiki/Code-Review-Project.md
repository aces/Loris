### Code-Review Project Usage

The content below serves as preliminary guidelines for using the ***Code Review*** project on the GitHub repository of LORIS. Failure or refusal to follow these guidelines shall be regarded as cause for disciplinary actions. 

#### Definitions

 - **Needs Review:** This category serves as the main entry point of a PR into the CR Project. A PR under this category can be in one of the following states
   - PR has just been created and just entered the *Code Review Process*.
   - PR was previously in the *Author Needs To Incorporate Changes* category following a code change request and all changes requested have been made.
 - **Needs Testing:** This category generally holds PRs that have underwent the review process and should now be manually tested by a developer. A PR in this category that has not been reviewed can still undergo review. A PR under this category can be in one of the following states
   - PR has just been Reviewed and is continuing the *Code Review Process*.
   - PR was previously in the *Author Needs To Incorporate Changes* category following a manual test failure and all changes requested have been made.
 - **Discussion needs resolution:** This category contains PRs which need discussion before any party can take any action towards the code.
 - **Author Needs To Incorporate Changes:** This category all PRs that awaiting changes by their author. PRs under this section will not be considered by the review or testing team until they are moved in the appropriate category.
 - **Needs Senior Developer Review:** This category serves as the last step of the *Code Review process*, any PR under this category is considered ready for merging unless a senior developer expresses any concerns. A PR in this category can be transferred by the senior staff to any of the previously mentioned categories and a comment describing issues with the PR will be added accordingly.

***N.B.** In this section it is critical to define the difference between two similar terms.*
 - ***Code Review Process*** designates the entire life cycle of a Pull Request from creation to merging/closing
 - ***Code Review*** or simply ***Review*** designates the action of commenting, approving or requesting changes on a PR solely based on reading the code changes involved. The *Code Review* is a subset of The *Code Review Process*.

#### Procedure and General Workflow

***N.B.** Three distinct entities will be mentioned below. It is the responsibility of the reader to be sure to understand the difference between them.*
 - *Author*: Creator of the Pull Request. 
 - *Reviewer*: Developer responsible of asserting that the code changes of a particular Pull Request agree with the LORIS standards.
 - *Tester*: Developer responsible for manually testing the Pull request and asserting that changes made serve their purpose and do not cause any negative or unpredictable effects on the remainder of the codebase.

***N.B.** It is the responsibility of the author, reviewers and testers to place a Pull Request in the appropriate category.*
 
***N.B.** This process is not linear, depending on the circumstances a PR can go through several loops or multiple iterations of the same loop before being merged.*

 - A Pull Request is issued by its author to the LORIS GitHub repository on the appropriate branch. 
 - The author adds the *Code Review* project from the *Conversation* page of the PR
 - The author adds the newly created PR to the **Needs Review** category from the GitHub *Projects* page.
 - Reviewers select a PR from the available list in the **Needs Review** category and self-assign themselves as *Reviewer* if not done so already.
   - A reviewer can select a PR from the **Needs Testing** section if and only if the PR has not been approved already.
 - After the review is completed, reviewers have the mandate to transfer the PR into the appropriate category: 
   - **Needs Testing** if code changes were approved and the *Passed Manual Tests* label does not exist on the Pull Request. 
   - **Author Needs To Incorporate Changes** if code changes are requested by reviewer.
   - **Needs Senior Developer Review** if code changes are approved and the *Passed Manual Tests* label has already been added to the PR.
 - Testers select a PR from either the **Needs Testing** or **Needs Review** sections and self-assign themselves as *Assignee* if not done so already.
 - After the testing is complete, testers have the mandate to append the *Passed Manual Tests* Label to the PR. Otherwise, testers need to move the PR in the **Author Needs To Incorporate Changes** section and describe the error or failure.
 - Authors are responsible of managing their own PRs categorised as **Author Needs To Incorporate Changes** and subsequently transfer them into the appropriate category:
   - **Needs Review** if review has not yet been done on PR.
   - **Needs Testing** if review was successfully completed and PR is still missing manual testing.
   - **Discussion needs resolution** if extensive discussion is required and issue can not move forward before a conclusion is reached.
 - The above steps are repeated until PR is safe to be moved into the **Needs Senior Developer Review** category at which point the senior staff has the responsibility of either demoting the PR into one of the previous categories or merging the PR which terminates the *Code Review Process*.
 
#### Acknowledged Ambiguities
 - **Label:"Needs Work"** and **Category:"Author Needs To Incorporate Changes"** are completely redundant and will be so only as long as the CR Project is in testing phase. Make sure to update both variables when need be during this period.
 - **Label:"Discussion Required"** and **Category:"Discussion needs resolution"** are completely redundant and will be so only as long as the CR Project is in testing phase. Make sure to update both variables when need be during this period.
 - **Category:"Needs Review"** and **Category:"Needs Testing"** are not practically mutually exclusive. A PR can be tested while it is in **Needs Review** and can be reviewed while it is categorised as **Needs Testing**. Github *Labels* and *Review Status* should be used to determine the stage of the process at which a specific Pull request is currently. 

https://docs.google.com/drawings/d/1S6mK6_7G097_MT4mKX_NAXSdACZ_21ybAInyBizBjf8/edit?usp=sharing 