# Training Module

The Training Module provides a platform to teach and certify the administration of instruments.

Each training session can consist of several tabs with the following types of content:
* Text
* PDF
* Video
* Quiz

The training session ends with a multiple choice quiz which allows the user to test their knowledge and become certified to deliver the instrument they were trained upon.

In order to set up training for a given instrument:

1. You must include the instrument in the `CertificationInstruments` section of the config.xml:
   ```xml
   <Certification>
       <EnableCertification>1</EnableCertification>
       <CertificationInstruments>
           <test value='Example_Instrument'>Example Instrument</test>
       </CertificationInstruments>
   </Certification>
   ```
   
   The `value` attribute must match a `Test_name` from the `test_names` table.
2. Set up the tabs for the training session by inserting into the `certificaion_training` table:
   You can add as many of these tabs as you would like, however, there there must be a quiz and it must be the final tab. No tabs prior to the final tab can be of type `quiz`.
   * __Text tab:__
     ```sql
     INSERT INTO certification_training (TestID, Title, Content, TrainingType, OrderNumber) VALUES (1, 'Description', '<p>Description of the instrument</p>', 'text', 1);
     ```
     The content can be supplied as HTML
     
   * __PDF tab:__
     ```sql
     INSERT INTO certification_training (TestID, Title, TrainingType, OrderNumber) VALUES (1, 'Example', 'pdf', 2);
     ```
     The PDF document must be placed in the `project/data/training/pdf/` folder, and must be have the same name as the instrument. For example, if the `Test_name` for the instrument was `Example_Instrument`, the PDF would be named `Example_Instrument.pdf`
     
   * __Video tab:__
     ```sql
     INSERT INTO certification_training (TestID, Title, TrainingType, OrderNumber) VALUES (1, 'Training Video', 'video', 3);
     ```
     The video must be MP4 format, and placed in the `project/data/training/video/` folder, and must be have the same name as the instrument. For example, if the `Test_name` for the instrument was `Example_Instrument`, the video would be named `Example_Instrument.mp4`
     
   * __Quiz tab:__
     ```sql
     INSERT INTO certification_training (TestID, Title, TrainingType, OrderNumber) VALUES (@testID, 'Quiz', 'quiz', 4);
     ```
     Follow the next set of directions to add questions to your quiz.
     
3. Add a quiz:
   * Insert questions into `certification_training_quiz_questions`:
     ```sql
     INSERT INTO certification_training_quiz_questions (TestID, Question, OrderNumber) VALUES (1, 'First quiz question?', 1);
     ```
   * Insert answers into `certifcation_training_quiz_answers`:
     ```sql
     INSERT INTO certification_training_quiz_answers (QuestionID, Answer, Correct, OrderNumber) VALUES (1, 'Answer 1', 0, 1);
     INSERT INTO certification_training_quiz_answers (QuestionID, Answer, Correct, OrderNumber) VALUES (1, 'Answer 2', 0, 2);
     INSERT INTO certification_training_quiz_answers (QuestionID, Answer, Correct, OrderNumber) VALUES (1, 'Answer 3 (Correct)', 1, 3);
     INSERT INTO certification_training_quiz_answers (QuestionID, Answer, Correct, OrderNumber) VALUES (1, 'Answer 4', 0, 4);
     ```
     One, and only one answer can be the correct answer.

__Note:__ Only users who are listed as examiners will be able to complete the training. Users who are not examiners but still have permission to view the Training Module will be able to see the training content, but will not be able to complete the quiz and become certified. You can edit the examiners through the Examiner Module.
