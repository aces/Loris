Instrument builder Test Plan

1.  Create Instrument
  * 1.a Add Header 
  * 1.b Add Label 
  * 1.c Add Scored Field 
    * 1.c.1 Validate that this requires both QuestionName and QuestionText 
  * 1.d Add Textbox 
    * 1.d.1 Validate that this requires both QuestionName and QuestionText 
  * 1.e Add Textarea  
    * 1.e.1 Validate that this requires both QuestionName and QuestionText 
  * 1.f Add Dropdown   
    * 1.f.1 Validate that this requires both QuestionName and QuestionText 
  * 1.g Add Multiselect 
    * 1.g.1 Validate that this requires both QuestionName and QuestionText 
  * 1.h Add Date 
    * 1.h.1 Validate that this requires both QuestionName and QuestionText 
    * 1.h.2 Validate adding range (startyear-endyear) 
  * 1.i Add Numeric 
    * 1.i.1 Validate that this requires both QuestionName and QuestionText 
    * 1.i.2 Validate adding range 
  * 1.j Add Blank Line 
  * 1.k Add Page break
2.  Edit Question Name and Question Text in the table directly and check if it sticks.
3.  Validate Instrument (Does not save if there is a same QuestionName twice)
4.  Save Instrument file
5.  Validate that not_answered option is added in the linst file for 1.e, 1.f, 1.g, 1.h
6.  Re-load existing instrument
  * 6.a Add questions
  * 6.b Save instrument file and ensure new changes are reflected in the file
7. Install and test instrument and rules implemented
8. Test functionality on mutiple broswers.
