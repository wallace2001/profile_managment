<?php

namespace App\Models;

use App\Http\Resources\UserResource;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'last_name',
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function hasPermission($permission)
    {
//        return $this->permissions()->where('name', $permission)->exists();
        return $this->roles()->whereHas('permissions', function($q) use ($permission) {
            $q->where('name', $permission);
        })->exists();
    }

    public function assignRole($role)
    {
        $role = Role::where('name', $role)->first();
        if ($role) {
            $this->roles()->syncWithoutDetaching($role);
        }
    }

    public function removeRole($role)
    {
        $role = Role::where('name', $role)->first();
        if ($role) {
            $this->roles()->detach($role);
        }
    }

    public function givePermissionTo($permissions)
    {
        if (is_array($permissions)) {
            $permissions = Permission::whereIn('name', $permissions)->get();
            foreach ($permissions as $permission) {
                $this->permissions()->syncWithoutDetaching($permission);
            }
        } else {
            $permission = Permission::where('name', $permissions)->first();
            if ($permission) {
                $this->permissions()->syncWithoutDetaching($permission);
            }
        }
    }

    public function createToken($name)
    {
        return new class {
            public function plainTextToken()
            {
                return bin2hex(random_bytes(32));
            }
        };
    }


    public function revokePermissionTo($permission)
    {
        $permission = Permission::where('name', $permission)->first();
        if ($permission) {
            $this->permissions()->detach($permission);
        }
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'user' => UserResource::make($this),
            'roles' => $this->roles()->pluck('name'),
            'permissions' => $this->permissions()->pluck('name'),
        ];
    }

    public function sendPasswordResetNotification($token)
    {
        $url = 'http://front.app/reset-password?token=' . $token . '&email=' . $this->email;
        $this->notify(new ResetPasswordNotification($url));
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
