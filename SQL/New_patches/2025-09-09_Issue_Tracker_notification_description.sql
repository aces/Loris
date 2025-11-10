UPDATE notification_modules 
	SET Description='Issue Tracker: All issues created or edited' 
	WHERE module_name='issue_tracker' AND operation_type='create/edit';
