<?
require_once 'NDB_Menu_Filter.class.inc';

class NDB_Menu_Filter_mri_protocol_check_violations extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        $user =& User::singleton();
        if (PEAR::isError($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission('view_final_radiological_review');
    }

    function _setupVariables()
    {
        $this->query = " FROM mri_violations_log l WHERE 1=1 ";
        $this->columns = array('l.PatientName','l.CandID','l.Visit_label','l.Severity', 'l.Header', 'l.Value', 'l.ValidRange', 'l.ValidRegex', 'l.SeriesUID', 'l.TarchiveID');
        $this->order_by = 'PatientName';
        $this->headers = array('PatientName',
                               'CandID',
                               'Visit_label',
                               'Severity',
                               'Header',
                               'Value',
                               'ValidRange',
                               'ValidRegex',
                               'SeriesUID'
        );
        $this->validFilters = array('l.TarchiveID', 'l.SeriesUID', 'l.PatientName', 'l.CandID');
        $this->formToFilter = array (
                                    'TarchiveID' => 'l.TarchiveID',
                                    'SeriesUID' => 'l.SeriesUID',
                                    'PatientName' => 'l.PatientName',
                                    'CandID' => 'l.CandID'
        );
    }

    function _setFilterForm()
    {

        $this->form->addElement('text', 'TarchiveID', 'Tarchive ID:', array("size"=>9, "maxlength"=>20));
        $this->form->addElement('text', 'PatientName', 'PatientName:', array("size"=>20, "maxlength"=>64));
        $this->form->addElement('text', 'CandID', 'CandID:', array("size"=>20, "maxlength"=>6));
        $this->form->addElement('text', 'SeriesUID', 'DICOM Series UID:', array("size"=>20, "maxlength"=>64));

    }


    function _setDataTableRows($count)
    {
        $x = 0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key == 'TarchiveID') {
                    $this->tpl_data['items'][$x]['TarchiveID'] = $val; #_makePretty($key, $val);
                    continue;
                }
                if ($key == 'Severity') {
                    $this->tpl_data['items'][$x]['severity'] = $val; #_makePretty($key, $val);
                }
                $row = array(
                    'value' => $val,
                    'name' => $key
                );
                $row['CandID'] = isset($item['CandID']) ? $item['CandID'] : '';
                $row['CommentID'] = isset($item['CommentID']) ? $item['CommentID'] : '';
                $row['SessionID'] = isset($item['SessionID']) ? $item['SessionID'] : '';


                $this->tpl_data['items'][$x][$i] = $row;
                $i++;
            }
            $x++;
        }
    }
}
