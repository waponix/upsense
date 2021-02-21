<?php

namespace Database\Seeders;

use App\Models\ZoneUser;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UsersSeeder::class,
            MenusTableSeeder::class,
            FolderTableSeeder::class,
            BREADSeeder::class,
            CompanySeeder::class,
            BranchSeeder::class,
            AuditSeeder::class,
            AlertSeeder::class,
            HubSeeder::class,
            SensorSeeder::class,
            NotificationSeeder::class,
            NotificationSettingSeeder::class,
            ZoneSeeder::class,
            ZoneUserSeeder::class,
            LogSeeder::class,
        ]);
    }
}
