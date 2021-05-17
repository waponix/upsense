<div class="actions">
    <a href="{{ url('/users/' . $id) }}"
       class="btn inline-block btn-primary">
        <i class="cil-magnifying-glass"></i>
    </a>
    <a href="{{ url('/users/' . $id . '/edit') }}"
       class="btn inline-block btn-primary">
        <i class="cil-pencil"></i>
    </a>

    @if(session('user')->id !== $id )
        <form
            action="{{ route('users.destroy', $$id ) }}"
            method="POST" class="inline-block">
            @method('DELETE')
            @csrf
            <button class="btn btn-danger">
                <i class="cil-trash"></i>
            </button>
        </form>
    @endif
</div>
