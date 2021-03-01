<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;

class MenusTableSeeder extends Seeder
{
    private $menuId = null;
    private $dropdownId = array();
    private $dropdown = false;
    private $sequence = 1;
    private $joinData = array();
    private $adminRole = null;
    private $userRole = null;
    private $managerRole = null;
    private $subFolder = '';

    public function join($roles, $menusId)
    {
        $roles = explode(',', $roles);
        foreach ($roles as $role) {
            array_push($this->joinData, array('role_name' => $role, 'menus_id' => $menusId));
        }
    }

    /*
        Function assigns menu elements to roles
        Must by use on end of this seeder
    */
    public function joinAllByTransaction()
    {
        DB::beginTransaction();
        foreach ($this->joinData as $data) {
            DB::table('menu_role')->insert([
                'role_name' => $data['role_name'],
                'menus_id' => $data['menus_id'],
            ]);
        }
        DB::commit();
    }

    public function insertLink($roles, $name, $href, $icon = null)
    {
        $href = $this->subFolder . $href;
        if ($this->dropdown === false) {
            DB::table('menus')->insert([
                'slug' => 'link',
                'name' => $name,
                'icon' => $icon,
                'href' => $href,
                'menu_id' => $this->menuId,
                'sequence' => $this->sequence
            ]);
        } else {
            DB::table('menus')->insert([
                'slug' => 'link',
                'name' => $name,
                'icon' => $icon,
                'href' => $href,
                'menu_id' => $this->menuId,
                'parent_id' => $this->dropdownId[count($this->dropdownId) - 1],
                'sequence' => $this->sequence
            ]);
        }
        $this->sequence++;
        $lastId = DB::getPdo()->lastInsertId();
        $this->join($roles, $lastId);
        $permission = Permission::where('name', '=', $name)->get();
        if (empty($permission)) {
            $permission = Permission::create(['name' => 'visit ' . $name]);
        }
        $roles = explode(',', $roles);
        if (in_array('user', $roles)) {
            $this->userRole->givePermissionTo($permission);
        }
        if (in_array('manager', $roles)) {
            $this->managerRole->givePermissionTo($permission);
        }
        if (in_array('admin', $roles)) {
            $this->adminRole->givePermissionTo($permission);
        }
        return $lastId;
    }

    public function insertTitle($roles, $name)
    {
        DB::table('menus')->insert([
            'slug' => 'title',
            'name' => $name,
            'menu_id' => $this->menuId,
            'sequence' => $this->sequence
        ]);
        $this->sequence++;
        $lastId = DB::getPdo()->lastInsertId();
        $this->join($roles, $lastId);
        return $lastId;
    }

    public function beginDropdown($roles, $name, $icon = '')
    {
        if (count($this->dropdownId)) {
            $parentId = $this->dropdownId[count($this->dropdownId) - 1];
        } else {
            $parentId = null;
        }
        DB::table('menus')->insert([
            'slug' => 'dropdown',
            'name' => $name,
            'icon' => $icon,
            'menu_id' => $this->menuId,
            'sequence' => $this->sequence,
            'parent_id' => $parentId
        ]);
        $lastId = DB::getPdo()->lastInsertId();
        array_push($this->dropdownId, $lastId);
        $this->dropdown = true;
        $this->sequence++;
        $this->join($roles, $lastId);
        return $lastId;
    }

    public function endDropdown()
    {
        $this->dropdown = false;
        array_pop($this->dropdownId);
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* Get roles */
        $this->adminRole = Role::where('name', '=', 'admin')->first();
        $this->userRole = Role::where('name', '=', 'user')->first();
        $this->managerRole = Role::where('name', '=', 'manager')->first();

        /* Create Custom Sidebar menu */
        DB::table('menulist')->insert([
            'name' => 'sidebar menu'
        ]);

        $this->menuId = DB::getPdo()->lastInsertId();  //set menuId
        $this->insertLink('user,manager,admin', 'Dashboard', '/', 'cil-speedometer');
        $this->insertTitle('manager,admin', 'Management');
        $this->beginDropdown('manager,admin', 'Maintenance', 'cil-settings');
        $this->insertLink('manager,admin', 'Users', '/users', 'cil-user');
//        $this->insertLink('manager,admin', 'Roles', '/roles', 'cil-user');
        $this->insertLink('manager,admin', 'Zones', '/zones', 'cil-location-pin');
//        $this->insertLink('manager,admin', 'Branch', '/branch', 'cil-vector');
        $this->insertLink('manager,admin', 'Company', '/company', 'cil-globe');
        $this->endDropdown();

        $this->insertLink('user,manager,admin', 'Hubs', '/hubs', 'cil-tablet');
        $this->insertLink('user,manager,admin', 'Sensors', '/sensors', 'cil-blur-circular');
        $this->insertLink('user,manager,admin', 'Reports', '/reports', 'cil-chart-pie');
        $this->insertLink('user,manager,admin', 'Logs', '/notifications/logs', 'cil-book');
        $this->insertLink('user,manager,admin', 'Alerts', '/notifications/alerts', 'cil-bell');

        $this->beginDropdown('admin', 'Settings', 'cil-calculator');
        $this->insertLink('admin', 'Notifications', '/settings/notifications');
//        $this->insertLink('admin', 'Menu Setup', '/menu/menu');
//        $this->insertLink('admin', 'Menu Elements Setup', '/menu/element');
//        $this->insertLink('admin', 'Roles Setup', '/roles');
//        $this->insertLink('admin', 'Bread Setup', '/bread');
        $this->endDropdown();

//        $this->insertLink('user,manager,admin', 'Logout', '/logout', 'cil-account-logout');


//        /* Create top menu */
//        DB::table('menulist')->insert([
//            'name' => 'top menu'
//        ]);
//        $this->menuId = DB::getPdo()->lastInsertId();  //set menuId
//        $this->beginDropdown('guest,user,admin', 'Pages');
//        $id = $this->insertLink('guest,user,admin', 'Dashboard',    '/');
//        $id = $this->insertLink('user,admin', 'Notes',              '/notes');
//        $id = $this->insertLink('admin', 'Users',                   '/users');
//        $this->endDropdown();
//        $id = $this->beginDropdown('admin', 'Settings');
//
//        $id = $this->insertLink('admin', 'Edit menu',               '/menu/menu');
//        $id = $this->insertLink('admin', 'Edit menu elements',      '/menu/element');
//        $id = $this->insertLink('admin', 'Edit roles',              '/roles');
//        $id = $this->insertLink('admin', 'Media',                   '/media');
//        $id = $this->insertLink('admin', 'BREAD',                   '/bread');
//        $this->endDropdown();

        $this->joinAllByTransaction(); ///   <===== Must by use on end of this seeder
    }
}
