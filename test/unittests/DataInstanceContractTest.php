<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;

/**
 * Validates the DataInstance contract is consistently implemented.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataInstanceContractTest extends TestCase
{
    /**
     * Ensure DataInstance extends AccessibleResource.
     *
     * @return void
     */
    public function testDataInstanceExtendsAccessibleResource(): void
    {
        $interfaces = class_implements(\LORIS\Data\DataInstance::class);
        $this->assertContains(
            \LORIS\StudyEntities\AccessibleResource::class,
            $interfaces
        );
    }

    /**
     * Ensure each DataInstance class declares isAccessibleBy with a bool return.
     *
     * @return void
     */
    public function testAllDataInstancesDeclareIsAccessibleBy(): void
    {
        $files = $this->_getDataInstanceFiles();
        $this->assertNotEmpty($files, 'No DataInstance classes found');

        $pattern = '/public\\s+function\\s+isAccessibleBy\\s*\\('
            . '\\s*\\\\User\\s+\\$user\\s*\\)\\s*:\\s*bool/s';
        foreach ($files as $file) {
            $contents = file_get_contents($file);
            $this->assertNotFalse($contents, "Unable to read file: $file");
            $this->assertMatchesRegularExpression(
                $pattern,
                $contents,
                "Missing required isAccessibleBy signature in $file"
            );
        }
    }

    /**
     * Discover PHP files containing DataInstance implementations.
     *
     * @return string[]
     */
    private function _getDataInstanceFiles(): array
    {
        $roots = [
            __DIR__ . '/../../src',
            __DIR__ . '/../../php',
            __DIR__ . '/../../modules',
        ];

        $matches      = [];
        $classPattern = '/class\\s+\\w+(?:\\s+extends\\s+[\\w\\\\]+)?\\s+'
            . 'implements[\\s\\S]{0,250}?DataInstance[\\s\\S]{0,120}?\\{/s';

        foreach ($roots as $root) {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($root)
            );
            foreach ($iterator as $file) {
                $extension = strtolower($file->getExtension());
                if (!$file->isFile()
                    || !in_array($extension, ['php', 'inc'], true)
                ) {
                    continue;
                }

                $path     = $file->getPathname();
                $contents = file_get_contents($path);
                if ($contents === false) {
                    continue;
                }
                if (preg_match($classPattern, $contents) === 1) {
                    $matches[] = $path;
                }
            }
        }

        sort($matches);
        return $matches;
    }
}
