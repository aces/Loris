<?php declare(strict_types=1);

/**
 * Migrates legacy candidate identifier configuration from config.xml
 * into the candidate_identifier_types database table
 *
 * Does not modify config.xml or existing candidate identifier values
 */

require_once __DIR__ . "/../generic_includes.php";

$config = \NDB_Factory::singleton()->config();
$DB     = $lorisInstance->getDatabaseConnection();

$identifierSettings = [
    'PSCID'      => $config->getSetting('PSCID'),
    'ExternalID' => $config->getSetting('ExternalID'),
];

/**
 * Convert a legacy XML identifier definition into a format template
 *
 * @param array<string, mixed> $settings Legacy identifier settings
 *
 * @return string
 */
function convertIdentifierFormat(array $settings): string
{
    $generation = match ($settings['generation'] ?? '') {
        'sequential' => 'SEQUENCE',
        'random' => 'RANDOM',
        'user' => null,
        default => throw new \RuntimeException('Unsupported identifier generation method'),
    };

    $seqs = $settings['structure']['seq'] ?? [];

    if (isset($seqs['@'])) {
        $seqs = [$seqs];
    }

    $format = '';
    $generationCount = 0;

    foreach ($seqs as $seq) {
        $attributes = $seq['@'] ?? [];

        switch ($attributes['type'] ?? '') {
        case 'siteAbbrev':
            $format .= '{SITE:ALIAS}';
            break;

        case 'projectAbbrev':
            $format .= '{PROJECT:ALIAS}';
            break;

        case 'static':
            $format .= $seq['#'] ?? '';
            break;

        case 'numeric':
        case 'alphanumeric':
        case 'alpha':
            $generationCount++;

            $length = $attributes['length'] ?? null;

            if (
                $length === null || !ctype_digit((string) $length)
                || (int) $length < 1
            ) {
                throw new \RuntimeException(
                    'Identifier sequence must have a positive fixed length'
                );
            }

            $segment = $generation === null
                ? sprintf(
                    '{%s:%d',
                    strtoupper($attributes['type']),
                    (int) $length
                )
                : sprintf(
                    '{%s:%d,FORMAT:%s',
                    $generation,
                    (int) $length,
                    $attributes['type']
                );

            if ($generation !== null) {
                foreach (['min' => 'MIN', 'max' => 'MAX'] as $key => $option) {
                    if (isset($attributes[$key])) {
                        $segment .= ',' . $option . ':' . $attributes[$key];
                    }
                }
            }

            $format .= $segment . '}';
            break;

        default:
            throw new \RuntimeException(
                'Unsupported identifier sequence type: '
                . ($attributes['type'] ?? '(missing)')
            );
        }
    }

    if ($generationCount !== 1) {
        throw new \RuntimeException(
            'Expected exactly one identifier segment'
        );
    }

    return $format;
}

foreach ($identifierSettings as $name => $settings) {
    $existingID = $DB->pselectOne(
        "SELECT CandidateIdentifierTypeID
         FROM candidate_identifier_types
         WHERE Name = :name",
        ['name' => $name]
    );

    if (!empty($existingID)) {
        echo "Skipping existing identifier type: $name\n";
        continue;
    }

    $format = convertIdentifierFormat($settings);

    // TODO: IsRequired, IsUnique and AllowMultiple settings are not explicitly
    // defined in config.xml
    $DB->insert(
        'candidate_identifier_types',
        [
            'Name'          => $name,
            'Format'        => $format,
            'IsRequired'    => $name === 'PSCID' ? 1 : 0,
            'IsUnique'      => 1,
            'AutoGenerate'  => $settings['generation'] === 'user' ? 0 : 1,
            'AllowMultiple' => 0,
        ]
    );

    echo "Created identifier type: $name\n";
}