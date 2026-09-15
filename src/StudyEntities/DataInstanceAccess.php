<?php declare(strict_types=1);

namespace LORIS\StudyEntities;

/**
 * Utility helpers for DataInstance access checks.
 */
final class DataInstanceAccess
{
    /**
     * Utility class.
     */
    private function __construct()
    {
    }

    /**
     * Return true if the user has at least one matching center on the resource.
     *
     * @param \User  $user     User whose access is being checked.
     * @param object $resource Data resource with center getters.
     *
     * @return bool
     */
    public static function centerMatch(\User $user, object $resource): bool
    {
        $centerData = self::getMethodValue(
            $resource,
            [
             'getCenterIDs',
             'getCenterIds',
             'getCenterID',
             'getCenterId',
            ]
        );
        if (!$centerData['found']) {
            return false;
        }

        $centers = self::normalizeCenters($centerData['value']);
        if (count($centers) === 0) {
            return false;
        }

        foreach ($centers as $center) {
            if ($user->hasCenter($center)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return true if the user has at least one matching project on the resource.
     *
     * @param \User  $user             User whose access is being checked.
     * @param object $resource         Data resource with project getters.
     * @param bool   $allowNullProject Whether null project means accessible.
     *
     * @return bool
     */
    public static function projectMatch(
        \User $user,
        object $resource,
        bool $allowNullProject = false
    ): bool {
        $projectData = self::getMethodValue(
            $resource,
            [
             'getProjectIDs',
             'getProjectIds',
             'getProjectID',
             'getProjectId',
            ]
        );
        if (!$projectData['found']) {
            return false;
        }

        if ($projectData['value'] === null) {
            return $allowNullProject;
        }

        $value = $projectData['value'];
        if (!is_iterable($value)) {
            $project = self::normalizeProject($value);
            return $project !== null && $user->hasProject($project);
        }

        $projects = [];
        foreach ($value as $project) {
            if ($project === null && $allowNullProject) {
                return true;
            }
            $normalized = self::normalizeProject($project);
            if ($normalized !== null) {
                $projects[] = $normalized;
            }
        }
        if (count($projects) === 0) {
            return false;
        }

        foreach ($projects as $project) {
            if ($user->hasProject($project)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return true if center and project access checks both pass.
     *
     * @param \User  $user             User whose access is being checked.
     * @param object $resource         Data resource.
     * @param bool   $allowNullProject Whether null project means accessible.
     *
     * @return bool
     */
    public static function centerAndProjectMatch(
        \User $user,
        object $resource,
        bool $allowNullProject = false
    ): bool {
        return self::centerMatch($user, $resource)
            && self::projectMatch($user, $resource, $allowNullProject);
    }

    /**
     * Try calling the first existing method from a list of method names.
     *
     * @param object   $resource Object to read from.
     * @param string[] $methods  Candidate method names.
     *
     * @return array{found: bool, value: mixed}
     */
    private static function getMethodValue(object $resource, array $methods): array
    {
        foreach ($methods as $method) {
            if (method_exists($resource, $method)) {
                try {
                    return [
                            'found' => true,
                            'value' => $resource->$method(),
                           ];
                } catch (\Throwable) {
                    return [
                            'found' => false,
                            'value' => null,
                           ];
                }
            }
        }
        return [
                'found' => false,
                'value' => null,
               ];
    }

    /**
     * Normalize a center payload to a list of CenterID objects.
     *
     * @param mixed $value Center payload.
     *
     * @return \CenterID[]
     */
    private static function normalizeCenters(mixed $value): array
    {
        if ($value === null) {
            return [];
        }

        if ($value instanceof \CenterID) {
            return [$value];
        }

        if (!is_iterable($value)) {
            $center = self::normalizeCenter($value);
            return $center === null ? [] : [$center];
        }

        $centers = [];
        foreach ($value as $center) {
            $normalized = self::normalizeCenter($center);
            if ($normalized !== null) {
                $centers[] = $normalized;
            }
        }
        return $centers;
    }

    /**
     * Normalize one center value.
     *
     * @param mixed $center Center value.
     *
     * @return ?\CenterID
     */
    private static function normalizeCenter(mixed $center): ?\CenterID
    {
        if ($center instanceof \CenterID) {
            return $center;
        }
        if (is_int($center)) {
            try {
                return \CenterID::singleton($center);
            } catch (\Throwable) {
                return null;
            }
        }
        if (is_string($center) && ctype_digit($center)) {
            try {
                return \CenterID::singleton((int) $center);
            } catch (\Throwable) {
                return null;
            }
        }
        return null;
    }

    /**
     * Normalize one project value.
     *
     * @param mixed $project Project value.
     *
     * @return ?\ProjectID
     */
    private static function normalizeProject(mixed $project): ?\ProjectID
    {
        if ($project instanceof \ProjectID) {
            return $project;
        }
        if (is_int($project)) {
            try {
                return \ProjectID::singleton($project);
            } catch (\Throwable) {
                return null;
            }
        }
        if (is_string($project) && ctype_digit($project)) {
            try {
                return \ProjectID::singleton((int) $project);
            } catch (\Throwable) {
                return null;
            }
        }
        return null;
    }
}
