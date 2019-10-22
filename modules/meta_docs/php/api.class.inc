<?php declare(strict_types=1);

namespace LORIS\meta_docs;

class Api extends \NDB_Page
{
    public function hasAccess(\User $user): bool
    {
        return true;
    }
}
