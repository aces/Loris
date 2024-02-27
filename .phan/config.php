<?php

return [
    "backward_compatibility_checks" => true,
    // The docs on quick_mode at
    // https://github.com/phan/phan/wiki/Incrementally-Strengthening-Analysis
    // don't seem reasonable. They claim that quick_mode=true add more errors.
    // This is false on the assumption that that's a typo.
    // It doesn't seem to have any effect on LORIS's codebase anyways.
    "quick_mode" => false,
    "analyze_signature_compatibility" => true,
    // The default severity level for phan is 5. After removing all the
    // suppressed rules, we should consider reducing this value to detect more
    // suspicious code.
    "minimum_severity" => 1,
    "allow_missing_properties" => false,
    "null_casts_as_any_type" => false,
    "scalar_implicit_cast" => false,
    // The line below is required to prevent PhanUndeclaredVariable problems in
    // the bvl_feedback ajax scripts. They all require() a file in this directory
    // that declares the $feedbackThread variable. Phan doesn't know about this.
    //
    // Toggling the below rule to true is the suggested fix by the phan devs.
    // see https://github.com/phan/phan/issues/1650.
    //
    // When the module is refactored, this line should be deleted.
    "ignore_undeclared_variables_in_global_scope" => true,
    // FIXME: We should add this.
    "dead_code_detection" => false,
    "unused_variable_detection" => true,
    "suppress_issue_types" => [
        "PhanUnusedPublicNoOverrideMethodParameter",
        // Until phan/phan#4746 is fixed
        "PhanTypeMismatchArgumentInternal"
    ],
    "analyzed_file_extensions" => ["php", "inc"],
    "directory_list" => [
        "php",
        "htdocs",
        "modules",
	"src",
        "vendor",
        "test"
    ],
    'exclude_file_list' => [
        'vendor/squizlabs/php_codesniffer/tests/Core/Tokenizer/DoubleQuotedStringTest.inc'
    ],
    "exclude_analysis_directory_list" => [
        "vendor"
    ],
    "autoload_internal_extension_signatures" => [
        // Xdebug stubs are bundled with Phan 0.10.1+/0.8.9+ for usage,
        // because Phan disables xdebug by default.
        "xdebug"     => "vendor/phan/phan/.phan/internal_stubs/xdebug.phan_php",
    ],
    "plugins" => [
        "UnreachableCodePlugin",
    ]
];
