INSERT INTO notification_types
  (Type, private, Description)
  VALUES
  ('imaging non minc file insertion', 1, 'Insertion of a non-MINC file into the MRI tables (files/parameter_file)');

UPDATE notification_types
  SET Description = 'Insertion of a MINC file into the MRI tables (files/parameter_file)'
  WHERE Type = 'minc insertion';