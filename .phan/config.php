<?php

return [
	"backward_compatibility_checks" => true,
	// The docs on quick_mode at
	// https://github.com/etsy/phan/wiki/Incrementally-Strengthening-Analysis
	// don't seem reasonable. They claim that quick_mode=true add more errors.
	// This is false on the assumption that that's a typo.
	// It doesn't seem to have any effect on LORIS's codebase anyways.
	"quick_mode" => false,
	// FIXME: analyze signature compatibility should be true, but
	// there's too many other things to fix first.
	"analyze_signature_compatibility" => false,
	// FIXME: allow_missing_properties should be false, but there's
	// too many other things to fix first.
	"allow_missing_properties" => true,
	// FIXME: null_casts_as_any_type should be false.
	// This only adds 2 errors, which should be fairly easy to fix.
	"null_casts_as_any_type" => true,
	"scalar_implicit_cast" => false,
	"ignore_undeclared_variables_in_global_scope" => false,
	"suppress_issue_types" => [
		"PhanDeprecatedFunction",
		"PhanRedefineClass",
		"PhanUndeclaredMethod",
		"PhanUndeclaredFunction",
		"PhanUndeclaredVariable",
		"PhanUndelcaredStaticMethod",
		"PhanUndeclaredClassMethod",
		"PhanUndeclaredTypeParameter",
		"PhanUndeclaredConstant",
		"PhanUndeclaredClass",
		"PhanUndeclaredClassCatch",
		"PhanUndeclaredStaticMethod",
		"PhanUndeclaredExtendedClass",
		"PhanTypeMismatchForeach",
		"PhanTypeMismatchDefault",
		"PhanTypeMismatchArgument",
		"PhanTypeMismatchArgumentInternal",
		"PhanTypeMismatchReturn",
		"PhanTypeMismatchProperty",
		"PhanTypeMissingReturn",
		"PhanNonClassMethodCall",
		"PhanTypeVoidAssignment",
		"PhanParamTooFew",
		"PhanParamTooMany",
		"PhanStaticCallToNonStatic",
		"PhanTypeComparisonToArray",
		"PhanTypeArraySuspicious",
		"PhanTypeInvalidRightOperand",
		"PhanRedefineFunctionInternal",
		"PhanRedefineFunction",
		"PhanNoopVariable",
		"PhanParamSpecial1",
		"PhanParamSpecial2",
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
		/* Modules should be included, but there's enough problems
		identified by phan without the modules included.. */
		// "modules",
		"vendor",
	],
	"exclude_analysis_directory_list" => [
		"vendor",
	],
];
