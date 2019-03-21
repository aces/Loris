<?php

return [
	"backward_compatibility_checks" => true,
	// The docs on quick_mode at
	// https://github.com/etsy/phan/wiki/Incrementally-Strengthening-Analysis
	// don't seem reasonable. They claim that quick_mode=true add more errors.
	// This is false on the assumption that that's a typo.
	// It doesn't seem to have any effect on LORIS's codebase anyways.
	"quick_mode" => false,
	"analyze_signature_compatibility" => true,
	// FIXME: allow_missing_properties should be false, but there's
	// too many other things to fix first.
	"allow_missing_properties" => true,
	"null_casts_as_any_type" => false,
	"scalar_implicit_cast" => false,
	"ignore_undeclared_variables_in_global_scope" => false,
	"suppress_issue_types" => [
        "PhanTypeInvalidDimOffset",
		"PhanUndeclaredMethod",
		"PhanUndeclaredVariableDim",
        "PhanTypeMismatchDimFetch",
		"PhanUndeclaredClassMethod",
		"PhanTypeMismatchArgument",
		"PhanTypeMismatchReturn",
		"PhanTypeMismatchProperty",
        "PhanTypeSuspiciousStringExpression",
	],
	"analyzed_file_extensions" => ["php", "inc"],
	"directory_list" => [
		/* This doesn't include php/installer, because there's
		   (intentionally) classes in the installer namespace
           which redeclare classes from php/libraries, in order
		   to bootstrap the installer before the config/database
		   is set up */
		"php",
		"htdocs",
		"modules",
        "src",
		"vendor",
        "test"
	],
	"exclude_analysis_directory_list" => [
		"vendor",
		"htdocs/api/",
	],
    'autoload_internal_extension_signatures' => [
        // Xdebug stubs are bundled with Phan 0.10.1+/0.8.9+ for usage,
        // because Phan disables xdebug by default.
        'xdebug'     => 'vendor/phan/phan/.phan/internal_stubs/xdebug.phan_php',
    ],

    // The line below is required to prevent PhanUndeclaredVariable problems in
    // the bvl_feedback ajax scripts. They all require() a file in this directory
    // that declares the $feedbackThread variable. Phan doesn't know about this.
    //
    // Toggling the below rule to true is the suggested fix by the phan devs.
    // see https://github.com/phan/phan/issues/1650.
    //
    // When the module is refactored, this line should be deleted.
    'ignore_undeclared_variables_in_global_scope' => true
];
