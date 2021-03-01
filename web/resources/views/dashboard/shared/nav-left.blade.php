<div class="c-sidebar-brand">
    <img class="c-sidebar-brand-full" src="{{ url('/assets/brand/logo.png') }}" height="46" alt="Upsense">
    <img class="c-sidebar-brand-minimized" src="{{ url('assets/brand/minimized_logo.png') }}" height="46" alt="Upsense">
</div>
<ul class="c-sidebar-nav ps">
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="//192.168.0.111:3000">
            <i class="cil-speedometer c-sidebar-nav-icon"></i>
            {{ __('Dashboard') }}
        </a>
    </li>
    @if($currentAuthenticatedUser->role == 'manager' || $currentAuthenticatedUser->role == 'admin')
        <li class="c-sidebar-nav-title">
            {{ __('Management') }}
        </li>
        <li class="c-sidebar-nav-dropdown"><a class="c-sidebar-nav-dropdown-toggle" href="#"><i
                    class="cil-settings c-sidebar-nav-icon"></i>{{ __('Maintenance') }}</a>
            <ul class="c-sidebar-nav-dropdown-items">

                <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link" href="{{ route('users.index')}}"><span
                            class="c-sidebar-nav-icon"></span>{{ __('Users') }}</a></li>
                {{--            <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link" href="{{ route('roles.index')}}"><span--}}
                {{--                        class="c-sidebar-nav-icon"></span>{{ __('Roles') }}</a></li>--}}
                @if($currentAuthenticatedUser->role == 'admin')

                    <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link" href="{{ route('zones.index')}}"><span
                                class="c-sidebar-nav-icon"></span>{{ __('Zones') }}</a></li>
                    <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link"
                                                      href="{{ route('company.index')}}"><span
                                class="c-sidebar-nav-icon"></span>{{ __('Company') }}</a></li>

                    <li class="c-sidebar-nav-item">
                        <a class="c-sidebar-nav-link" href="{{ route('hubs.index')}}">
                            <i class="c-sidebar-nav-icon"></i>
                            {{ __('Hubs') }}
                        </a>
                    </li>
                    <li class="c-sidebar-nav-item">
                        <a class="c-sidebar-nav-link" href="{{ route('sensors.index')}}">
                            <i class="c-sidebar-nav-icon"></i>
                            {{ __('Sensors') }}
                        </a>
                    </li>
                @endif
            </ul>
        </li>
    @endif


    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="{{ route('dashboard.devices')}}">
            <i class="cil-memory c-sidebar-nav-icon"></i>
            {{ __('Devices') }}
        </a>
    </li>
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="//192.168.0.111:3000/reports">
            <i class="cil-chart-pie c-sidebar-nav-icon"></i>
            {{ __('Reports') }}
        </a>
    </li>
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="//192.168.0.111:3000/notifications/logs">
            <i class="cil-book c-sidebar-nav-icon"></i>
            {{ __('Logs') }}
        </a>
    </li>
    <li class="c-sidebar-nav-item">
        <a class="c-sidebar-nav-link" href="//192.168.0.111:3000/notifications/alerts">
            <i class="cil-bell c-sidebar-nav-icon"></i>
            {{ __('Alerts') }}
        </a>
    </li>
    @if ($currentAuthenticatedUser->role == 'admin')
        <li class="c-sidebar-nav-dropdown"><a class="c-sidebar-nav-dropdown-toggle" href="#"><i
                    class="cil-calculator c-sidebar-nav-icon"></i>{{ __('Settings') }}</a>
            <ul class="c-sidebar-nav-dropdown-items">
                <li class="c-sidebar-nav-item"><a class="c-sidebar-nav-link"
                                                  href="//192.168.0.111:3000/settings/notifications"><span
                            class="c-sidebar-nav-icon"></span>{{ __('Notifications') }}</a></li>
            </ul>
        </li>
    @endif
    <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
        <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
    </div>
    <div class="ps__rail-y" style="top: 0px; right: 0px;">
        <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
    </div>
</ul>
<button class="c-sidebar-minimizer c-class-toggler" type="button" data-target="_parent"
        data-class="c-sidebar-minimized"></button>

</div>
