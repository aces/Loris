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
        "PhanTypeExpectedObjectPropAccessButGotNull",
        "PhanTypeInvalidDimOffset",
        "PhanTypeMismatchDimAssignment",
		"PhanRedefineClass",
		"PhanUndeclaredMethod",
		"PhanUndeclaredVariable",
		"PhanUndeclaredVariableDim",
		"PhanUndeclaredTypeReturnType",
        "PhanTypeMismatchDimFetch",
        "PhanTypeArraySuspiciousNullable",
		"PhanUndeclaredClassMethod",
		"PhanUndeclaredTypeParameter",
		"PhanUndeclaredConstant",
		"PhanUndeclaredClass",
		"PhanUndeclaredExtendedClass",
		"PhanTypeMismatchForeach",
		"PhanTypeMismatchDefault",
		"PhanTypeMismatchArgument",
		"PhanTypeMismatchArgumentInternal",
		"PhanTypeMismatchReturn",
		"PhanTypeMismatchProperty",
		"PhanNonClassMethodCall",
		"PhanTypeVoidAssignment",
		"PhanParamTooFew",
		"PhanParamTooMany",
		"PhanTypeArraySuspicious",
		"PhanRedefineFunctionInternal",
		"PhanRedefineFunction",
	],
	"analyzed_file_extensions" => ["php", "inc"],
	"directory_list" => [
		/* This doesn't include php/installer, because there's
		   (intentionally) classes in the installer namespace
           which redeclare classes from php/libraries, in order
		   to bootstrap the installer before the config/database
		   is set up */
		"php/libraries",
		"php/exceptions",
		"htdocs",
		"modules",
        "src",
		"vendor",
	],
	"exclude_analysis_directory_list" => [
		"vendor",
	],
];
