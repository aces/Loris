<?php
/**
 * This file contains the Role class.
 *
 * PHP Version 5-7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Loris Role class
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Role implements \LORIS\StudyEntities\AccessibleResource
{
    /**
     * Stores role information
     *
     * @var array
     */
    protected $roleInfo = [];

    /**
     * Constructor
     *
     * Selects a role and its permissions
     *
     * @param ?string $roleCode Identifies the role
     *
     * @return \Role A Role object if the Role specified by $roleCode exists
     * @access public
     */
    public static function &factory(?string $roleCode = null): \Role
    {
        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // get user data from database
        $row = $DB->pselectRow(
            "SELECT * FROM roles WHERE Code = :co",
            ['co' => $roleCode]
        );

        // if null, consider it as the "blocked" role.
        if (is_null($row)) {
            return self::_getBlockedRole();
        }

        // New role obj
        $obj = new Role;

        // attribute DB info
        $obj->roleInfo = $row;

        //
        return $obj;
    }

    /**
     * Create/get the blocked role archetype from DB.
     *
     * @return Role
     * @access private
     * @static
     */
    private static function _getBlockedRole(): \Role
    {
        $DB = \NDB_Factory::singleton()->database();
        $blocked = new \Role;
        $row = $DB->pselectRow(
            "SELECT * FROM roles WHERE Code = 'blocked'",
            []
        );
        $blocked->roleInfo = $row;
        return $blocked;
    }

    /**
     * Inserts data into the `roles` table.
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     * @static
     */
    public static function insert(array $set): void
    {
        \NDB_Factory::singleton()->database()->insert('roles', $set);
    }


    /**
     * Updates a role
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     */
    public function update(array $set): void
    {
        \NDB_Factory::singleton()->database()->update(
            'roles',
            $set,
            ['RoleID' => $this->roleInfo['RoleID']]
        );
    }


    /**
     * Returns the reole information as array.
     * 
     * @return array
     */
    public function asArray() : array
    {
        return $this->roleInfo;
    }

    /**
     * Returns data from the roleInfo array according to the key provided
     * as argument.
     *
     * @param string $var Name of variable to get
     *
     * @note   Call without any arguments to get the entire user data array
     * @return array<array|string>|string
     * @access public
     * @throws LorisException
     */
    public function getData(string $var = '')
    {
        return ($var === '') ? $this->roleInfo : $this->roleInfo[$var];
    }

    /**
     * Get the role's id
     *
     * @return int
     */
    function getId(): int
    {
        return intval($this->roleInfo['RoleID']);
    }

    /**
     * Get role code
     *
     * @return string
     */
    function getCode(): string
    {
        return $this->roleInfo['Code'];
    }

    /**
     * Get the role's description
     *
     * @return string
     */
    function getDescription(): string
    {
        return $this->roleInfo['Description'];
    }

    /**
     * Return true if the entity is accessible by the
     * user.
     *
     * @param \User $user The user whose access should be
     *                    validated
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasPermission('role_view')
                || $user->hasPermission('role_edit')
                || $user->hasPermission('role_assign');
    }
}