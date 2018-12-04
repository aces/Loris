<?php declare(strict_types=1);

use \Psr\Http\Message\UploadedFileInterface;

class FileUploadValidator {

    public $uploadDirectory;

    public function __construct(
        string $uploadDirectory, 
        array $permittedFileTypes = array()
    ){
        $this->uploadDirectory = $uploadDirectory;
        $this->permittedFileTypes = $permittedFileTypes;
        $this->_validate();
    }

    protected function _validate() {
        // Check upload path exist
        //
        // Check web user can write to it
        //
        // throw ConfigException
        //
        return;
    }

    /**
     * Given an array of files, validate them and upload them to the server.
     *
     * @param array $uploadedFiles
     * 
     * @throws \LorisException
     * @throws Exception\UploadedFileErrorException if the upload was not successful.
     * @throws Exception\InvalidArgumentException if the $path specified is invalid.
     * @throws Exception\UploadedFileErrorException on any error during the
     *     move operation, or on the second or subsequent call to the method.
     * @return void
     */
    public function upload(
        array $uploadedFiles, 
        array $permissions = array()
    ) {
        if (empty($uploadedFiles)) {
            return false;
        }

        foreach ($uploadedFiles as $uploadedFile) {
            $this->_validateFile($uploadedFile);
            $uploadedFile
                ->moveTo(
                    $this->uploadDirectory . basename(
                        $uploadedFile->getClientFilename()
                    )
                );
        }

    }

    private function _validateFile($uploadedFile) {
        print_r($uploadedFile);
        if (! $uploadedFile instanceof UploadedFileInterface) {
            throw new \LorisException(
                'File passed to FileUploadValidator is not an instance ' .
                'of UploadedFileInterface (has type: ' . 
                gettype($uploadedFile) .
                ')'
            );
        }
        //TODO
        //check file extension valid
        //check size
        //validate mime type
        // check that file doesn't already exist
    }





}
