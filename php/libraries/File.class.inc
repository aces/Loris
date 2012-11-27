<?php
/**
 * PHP File Operations wrapper 
 *
 * File 1.0 - A wrapper class to common
 * PHP file operations Copyright (c) 1999 CDI, cdi@thewebmasters.net
 * All Rights Reserved
 * extended by D. Vins & J. Harlap
 * @package efax
 */

Class File
{
    var $error = "";
    var $buffer = -1;
    var $statcache = array();
    var $tempdir = '/tmp';
    var $realuid = -1;
    var $realgid = -1;


    /**
     * constructor sets global php error msg
     *
     * @param  none
     * @acess  public
     * @return none
     */
    function File ()
    {
        global $php_errormsg;
        return;
    }
    
    function clear_cache()
    {
        unset($this->statcache);
        $this->statcache = array();
        return true;
    }

    function is_sane($fileName = "", $must_exist = 0, $noSymLinks = 0, $noDirs = 0)
    {
        $exists = false;

        if(empty($fileName)) {    return false; }
        if($must_exist != 0)
        {
            if(!file_exists($fileName))
            {
                $this->error = "is_sane: [$fileName] does not exist";
                return false;
            }
            $exists = true;
        }
        if($exists)
        {
            if(!is_readable($fileName))
            {
                $this->error = "is_sane: [$fileName] not readable";
                return false;
            }

            if($noDirs != 0)
            {
                if(is_dir($fileName))
                {
                    $this->error = "is_sane: [$fileName] is a directory";
                    return false;
                }
            }

            if($noSymLinks != 0)
            {
                if(is_link($fileName))
                {
                    $this->error = "is_sane: [$fileName] is a symlink";
                    return false;
                }
            }

        } // end if exists

        return true;        
    }


//    **************************************************************

    function read_file ($fileName = "" )
    {
        $contents = "";

        if(empty($fileName))
        {
            $this->error = "read_file: No file specified";
            return false;
        }
        if(!$this->is_sane($fileName,1,0,1))
        {
            // Preserve the is_sane() error msg
            return false;
        }
        $fd = @fopen($fileName,"r");

        if( (!$fd) || (empty($fd)) )
        {
            $this->error = "read_file: File error: [$php_errormsg]";
            return false;
        }

        $contents = fread($fd, filesize($fileName) );

        fclose($fd);

        return $contents;
    }

//    **************************************************************
//    Read a file via fgetss(), which strips all php/html
//    from the file.

    function strip_read ($fileName = "", $strip_cr = 0)
    {
        if(empty($fileName))
        {
            $this->error = "strip_read: No file specified";
            return false;
        }
        if(!$this->is_sane($fileName,1,0,1))
        {
            // Preserve the error
            return false;
        }
        if($this->buffer > 0)
        {
            $buffer = $this->buffer;
        } else {
            $buffer = filesize($fileName);
        }

        $contents = "";

        $fd = @fopen($fileName,"r");

        if( (!$fd) || (empty($fd)) )
        {
            $this->error = "strip_read: File error: [$php_errormsg]";
            return false;
        }
        while(!feof($fd))
        {
            $contents .= fgetss($fd,$buffer);
        }
        fclose($fd);
        return $contents;
    }

//    **************************************************************
    function write_file ($fileName,$Data)
    {
        $tempDir = $this->tempdir;
        $tempfile   = tempnam( $tempDir, "cdi" );

        if(!$this->is_sane($fileName,0,1,1))
        {
            return false;
        }

        if (file_exists($fileName))
        {
            if (!copy($fileName, $tempfile))
            {
                $this->error = "write_file: cannot create backup file [$tempfile] :  [$php_errormsg]";
                return false;
            }
        }

        $fd = @fopen( $tempfile, "a" );

        if( (!$fd) or (empty($fd)) )
        {
            $myerror = $php_errormsg;
            unlink($tempfile);
            $this->error = "write_file: [$tempfile] access error [$myerror]";
            return false;
        }

        fwrite($fd, $Data);

        fclose($fd);

        if (!copy($tempfile, $fileName))
        {
            $myerror = $php_errormsg;   // Stash the error, see above
            unlink($tempfile);
            $this->error = "write_file: Cannot copy file [$fileName] [$myerror]";
            return false;
        }

        unlink($tempfile);

        if(file_exists($tempfile))
        {
            // Not fatal but it should be noted
            $this->error = "write_file: Could not unlink [$tempfile] : [$php_errormsg]";
        }
        return true;
    }

//    **************************************************************
    function copy_file ($oldFile = "", $newFile = "")
    {
        if(empty($oldFile))
        {
            $this->error = "copy_file: oldFile not specified";
            return false;
        }
        if(empty($newFile))
        {
            $this->error = "copy_file: newFile not specified";
            return false;
        }
        if(!$this->is_sane($oldFile,1,0,1))
        {
            // preserve the error
            return false;
        }
        if(!$this->is_sane($newFile,0,1,1))
        {
            // preserve it
            return false;
        }

        if (! (@copy($oldFile, $newFile)))
        {
            $this->error = "copy_file: cannot copy file [$oldFile] [$php_errormsg]";
            return false;
        }

        return true;
    }

//    **********************************************

    function get_files ($root_dir, $fileExt = 'ALL_FILES')
    {
        $fileList = array();

        if(!is_dir($root_dir))
        {
            $this->error = "get_files: Sorry, [$root_dir] is not a directory";
            return false;
        }

        if(empty($fileExt))
        {
            $this->error = "get_files: No file extensions specified";
            return false;
        }

        $open_dir = @opendir($root_dir);

        if( (!$open_dir) or (empty($open_dir)) )
        {
            $this->error = "get_files: Failed to open dir [$root_dir] : $php_errormsg";
            return false;
        }

        $fileCount = 0;

        while ( $file = readdir($open_dir))
        {
            if( (!is_dir($file)) and (!empty($file)) )
            {
                if($fileExt == 'ALL_FILES')
                {
                    $fileList[$fileCount] = $file;
                    $fileCount++;
                }
                else
                {
                    if(preg_match("/.\.($fileExt)$/i",$file))
                    {
                        $fileList[$fileCount] = $file;
                        $fileCount++;
                    }
                }
            }
        }

        closedir($open_dir);
        return $fileList;

    }    // end get_files

    function is_owner($fileName, $uid = "")
    {
        if(empty($uid))
        {
            if($this->realuid < 0)
            {
                $tempDir = $this->tempdir;
                $tempFile = tempnam($tempDir,"cdi");
                if(!touch($tempFile))
                {
                    $this->error = "is_owner: Unable to create [$tempFile]";
                    return false;
                }
                $stats = stat($tempFile);
                unlink($tempFile);
                $uid = $stats[4];
            }
            else
            {
                $uid = $this->realuid;
            }
        }
        $fileStats = stat($fileName);
        if( (empty($fileStats)) or (!$fileStats) )
        {
            $this->error = "is_owner: Unable to stat [$fileName]";
            return false;
        }

        $this->statcache = $fileStats;

        $owner = $fileStats[4];
        if($owner == $uid)
        {
            return true;
        }

        $this->error = "is_owner: Owner [$owner] Uid [$uid] FAILED";
        return false;
    }

    function is_inGroup($fileName, $gid = "")
    {
        if(empty($gid))
        {
            if($this->realgid < 0)
            {
                $tempDir = $this->tempdir;
                $tempFile = tempnam($tempDir,"cdi");
                if(!touch($tempFile))
                {
                    $this->error = "is_inGroup: Unable to create [$tempFile]";
                    return false;
                }
                $stats = stat($tempFile);
                unlink($tempFile);
                $gid = $stats[5];
            }
            else
            {
                $gid = $this->realgid;
            }
        }
        $fileStats = stat($fileName);
        if( (empty($fileStats)) or (!$fileStats) )
        {
            $this->error = "is_inGroup: Unable to stat [$fileName]";
            return false;
        }

        $this->statcache = $fileStats;

        $group = $fileStats[5];
        if($group == $gid)
        {
            return true;
        }

        $this->error = "is_inGroup: Group [$group] Gid [$gid] FAILED";
        return false;
    }

    function get_real_uid()
    {
        $tempDir = $this->tempdir;
        $tempFile = tempnam($tempDir,"cdi");
        if(!touch($tempFile))
        {
            $this->error = "is_owner: Unable to create [$tempFile]";
            return false;
        }
        $stats = stat($tempFile);
        unlink($tempFile);
        $uid = $stats[4];
        $gid = $stats[5];
        $this->realuid = $uid;
        $this->realgid = $gid;
        return $uid;
    }

    function get_real_gid()
    {
        $uid = $this->get_real_uid();
        if( (!$uid) or (empty($uid)) )
        {
            return false;
        }
        return $this->realgid;
    }

}    // end class File

?>
