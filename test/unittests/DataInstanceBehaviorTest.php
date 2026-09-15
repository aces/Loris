<?php declare(strict_types=1);

require_once __DIR__
    . '/../../modules/mri_violations/php/mriviolation.class.inc';
require_once __DIR__
    . '/../../modules/mri_violations/php/protocolcheckviolation.class.inc';
require_once __DIR__
    . '/../../modules/dicom_archive/php/dicomarchiverowwithoutsession.class.inc';

use LORIS\dicom_archive\DICOMArchiveRowWithoutSession;
use LORIS\mri_violations\MRIViolation;
use LORIS\mri_violations\ProtocolCheckViolation;
use PHPUnit\Framework\TestCase;

/**
 * Targeted behaviour tests for custom DataInstance access implementations.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataInstanceBehaviorTest extends TestCase
{
    /**
     * Verify MRI violations allow matching center/project access.
     *
     * @return void
     */
    public function testMRIViolationAccessibleWithMatchingCenterAndProject(): void
    {
        $resource = new MRIViolation(
            [
                'Site'    => 1,
                'Project' => 2,
            ]
        );

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasPermission', 'hasCenter', 'hasProject'])
            ->getMock();
        $user->method('hasPermission')->willReturn(false);
        $user->method('hasCenter')->willReturn(true);
        $user->method('hasProject')->willReturn(true);

        $this->assertTrue($resource->isAccessibleBy($user));
    }

    /**
     * Verify MRI violations deny center mismatch without all-sites permission.
     *
     * @return void
     */
    public function testMRIViolationDeniedOnCenterMismatchWithoutAllSites(): void
    {
        $resource = new MRIViolation(
            [
                'Site'    => 1,
                'Project' => 2,
            ]
        );

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasPermission', 'hasCenter', 'hasProject'])
            ->getMock();
        $user->method('hasPermission')->willReturn(false);
        $user->method('hasCenter')->willReturn(false);
        $user->expects($this->never())->method('hasProject');

        $this->assertFalse($resource->isAccessibleBy($user));
    }

    /**
     * Verify protocol check violations allow rows with null center.
     *
     * @return void
     */
    public function testProtocolCheckViolationAllowsNullCenter(): void
    {
        $resource = new ProtocolCheckViolation(['CenterID' => null]);

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['hasPermission', 'hasCenter'])
            ->getMock();
        $user->method('hasPermission')->willReturn(false);
        $user->expects($this->never())->method('hasCenter');

        $this->assertTrue($resource->isAccessibleBy($user));
    }

    /**
     * Verify DICOM no-session rows are accessible by their creator.
     *
     * @return void
     */
    public function testDicomWithoutSessionAccessibleByCreator(): void
    {
        $creator = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getId'])
            ->getMock();
        $creator->method('getId')->willReturn(9);

        $resource = new DICOMArchiveRowWithoutSession([], $creator);

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getId', 'hasPermission'])
            ->getMock();
        $user->method('getId')->willReturn(9);
        $user->expects($this->never())->method('hasPermission');

        $this->assertTrue($resource->isAccessibleBy($user));
    }

    /**
     * Verify DICOM no-session rows are accessible via explicit permissions.
     *
     * @return void
     */
    public function testDicomWithoutSessionAccessibleByPermission(): void
    {
        $creator = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getId'])
            ->getMock();
        $creator->method('getId')->willReturn(3);

        $resource = new DICOMArchiveRowWithoutSession([], $creator);

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getId', 'hasPermission'])
            ->getMock();
        $user->method('getId')->willReturn(11);
        $user->method('hasPermission')->willReturnMap(
            [
                ['dicom_archive_view_allsites', true],
                ['dicom_archive_nosessionid', false],
            ]
        );

        $this->assertTrue($resource->isAccessibleBy($user));
    }

    /**
     * Verify DICOM no-session rows are denied without creator/permission.
     *
     * @return void
     */
    public function testDicomWithoutSessionDeniedWithoutCreatorOrPermissions(): void
    {
        $creator = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getId'])
            ->getMock();
        $creator->method('getId')->willReturn(3);

        $resource = new DICOMArchiveRowWithoutSession([], $creator);

        $user = $this->getMockBuilder(\User::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getId', 'hasPermission'])
            ->getMock();
        $user->method('getId')->willReturn(11);
        $user->method('hasPermission')->willReturn(false);

        $this->assertFalse($resource->isAccessibleBy($user));
    }
}
