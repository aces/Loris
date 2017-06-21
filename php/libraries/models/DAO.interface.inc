<?php
namespace LORIS\Models;

use LORIS\Models\VO;

interface DAO
{
    /**
     * Create a new DOA instance of the object
     *
     * @return VO
     */
    public function fetch(array $primary_key): VO;

    /**
     * Update the database with new values
     *
     * @param VO the modified object.
     *
     * @return void
     */
    public function update(VO $modifiedObject);
}
