<?php
/**
 * This file defines the concept of a data Provisioner.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data;

class MapIterator extends \IteratorIterator {
    protected $mapper;
    protected $user;

    public function __construct($rows, Mapper $mapper, \User $user) {
        parent::__construct($rows);
        $this->mapper = $mapper;
        $this->user = $user;
    }

    public function current() {
        $row = parent::current();
        return $this->mapper->Map($this->user, $row);
    }
}
