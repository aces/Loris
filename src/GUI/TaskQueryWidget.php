<?php
namespace LORIS\GUI;

class TaskQueryWidget extends TaskWidget {
    protected $sitelabel;
    public function __construct(\User $user, string $label, \Database $db, string $dbquery, string $allperm, string $sitefield, string $link) {
        $queryparams = [];
        $this->sitelabel = "Site: All";
        if($allperm != '') {
            if(!$user->hasPermission($allperm)) {
                $sites = $user->getCenterIDs();
                $queryparams['SiteID'] = implode(',', $sites);
                $dbquery .= " AND FIND_IN_SET($sitefield, :SiteID)";
                $this->sitelabel = "Site: All User Sites";
            }
        }

        $number = (int )$db->pselectOne($dbquery, $queryparams);
        if($number != 1) {
            $label .= "s";
        }

        parent::__construct($label, $number, $link);
    }

    public function SiteLabel() : string {
        return $this->sitelabel;
    }
}
