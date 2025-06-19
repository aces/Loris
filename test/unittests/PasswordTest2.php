<?php declare(strict_types=1);

use PHPUnit\Framework\TestCase;

class PasswordTest extends TestCase
{
    const VALID_PASSWORD = 'ComplexPass123!'; // Example of a valid password
    const MOCK_HASH_ALGO = PASSWORD_DEFAULT; // Use PHP's default password hash algorithm

    protected function setUp(): void
    {
        parent::setUp();

        // Mock NDB_Config
        $mockConfig = $this->createMock(\NDB_Config::class);
        $mockConfig->method('getSetting')
            ->with('passwordAlgorithm')
            ->willReturn(self::MOCK_HASH_ALGO);

        // Mock NDB_Factory to return the mocked config
        $mockFactory = $this->createMock(\NDB_Factory::class);
        $mockFactory->method('config')
            ->willReturn($mockConfig);

        // Replace singleton instance of NDB_Factory with the mock
        \NDB_Factory::setSingleton($mockFactory); // Assuming this is allowed in your implementation
    }

    public function testPasswordInstanceWithValidPassword(): void
    {
        // Test that a Password object can be instantiated with a valid password
        $password = new \Password(self::VALID_PASSWORD);

        $this->assertInstanceOf(\Password::class, $password);
        $this->assertNotEmpty((string) $password, "Password hash should not be empty.");
    }
}

