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
    // FIXME: allow_missing_properties should be false, but there's
    // too many other things to fix first.
    "allow_missing_properties" => true,
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
    // FIXME: We should add this. Note that dead_code_detection also covers
    // unused_variable_detection. It might be a good idea to enable this first.
    "unused_variable_detection" => false,
    "suppress_issue_types" => [
        "PhanTypePossiblyInvalidDimOffset",
        "PhanTypeMismatchArgument",
        "PhanTypeMismatchProperty",
        "PhanTypeArraySuspiciousNullable",
        "PhanUndeclaredMethod",
        "PhanUndeclaredClassMethod",
        "PhanUndeclaredClassCatch",
        "PhanUnreferencedUseNormal",
        "PhanUndeclaredTypeParameter",
        "PhanUndeclaredTypeReturnType",
        "PhanUndeclaredTypeThrowsType",
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
