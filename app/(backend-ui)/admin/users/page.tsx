'use client';

import { useEffect, useState } from 'react';
import { adminRequest, fetchAdminUsers } from '@/lib/admin-api';
import { 
  FaUsers, FaUserPlus, FaTrash, FaFloppyDisk, 
  FaMagnifyingGlass, FaShieldHalved, FaPenToSquare,
  FaCheck, FaBan, FaKey
} from 'react-icons/fa6';

interface UserMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedDate: string;
  articlesCount: number;
}

function mapUser(user: any): UserMember {
  const createdAt = user?.created_at ?? user?.createdAt;
  const joinedDate = createdAt ? new Date(createdAt) : null;
  const userType = user?.user_type ?? user?.role?.name ?? user?.role ?? 'User';
  const status = user?.status;

  return {
    id: String(user?.id ?? ''),
    name: String(user?.name ?? 'Unnamed user'),
    email: String(user?.email ?? ''),
    role: String(userType) === 'Admin' ? 'Super Admin' : String(userType),
    status: status === undefined || status === null || status === true || status === 1 || status === '1' || String(status).toLowerCase() === 'active'
      ? 'ACTIVE'
      : 'SUSPENDED',
    joinedDate: joinedDate && !Number.isNaN(joinedDate.getTime())
      ? joinedDate.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—',
    articlesCount: Number(user?.articles_count ?? user?.news_count ?? 0),
  };
}

function unwrapCurrentUser(payload: any) {
  return payload?.data?.user ?? payload?.data ?? payload?.user ?? payload;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserMember[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserMember['role']>('Reporter');

  const activeUser = users.find((u) => u.id === selectedUserId) || users[0];

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setLoadingUsers(true);
      setLoadError(null);
      const [usersResult, currentUserResult] = await Promise.allSettled([
        fetchAdminUsers(),
        adminRequest<any>('/me'),
      ]);

      if (!active) return;

      const records = usersResult.status === 'fulfilled' ? [...usersResult.value] : [];
      const currentUser = currentUserResult.status === 'fulfilled'
        ? unwrapCurrentUser(currentUserResult.value)
        : null;

      if (currentUser?.id != null) {
        const currentId = String(currentUser.id);
        const currentEmail = String(currentUser.email ?? '').toLowerCase();
        const alreadyListed = records.some((user) =>
          String(user?.id ?? '') === currentId ||
          (currentEmail && String(user?.email ?? '').toLowerCase() === currentEmail),
        );
        if (!alreadyListed) records.unshift(currentUser);
      }

      const loadedUsers = records
        .filter((user) => user?.id !== undefined && user?.id !== null)
        .map(mapUser);
      setUsers(loadedUsers);
      setSelectedUserId(
        loadedUsers.find((user) => String(user.id) === String(currentUser?.id))?.id ??
          loadedUsers[0]?.id ??
          '',
      );

      if (usersResult.status === 'rejected') {
        setLoadError(usersResult.reason instanceof Error
          ? usersResult.reason.message
          : 'Could not load the user directory.');
      } else if (loadedUsers.length === 0) {
        setLoadError('The user directory returned no accounts.');
      }

      setLoadingUsers(false);
    }

    void loadUsers();
    return () => {
      active = false;
    };
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: UserMember = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: 'ACTIVE',
      joinedDate: '০৫ আগস্ট ২০২৬',
      articlesCount: 0,
    };

    setUsers([newUser, ...users]);
    setSelectedUserId(newUser.id);
    setNewName('');
    setNewEmail('');
  };

  const updateActiveUser = (field: keyof UserMember, value: any) => {
    setUsers(
      users.map((u) => (u.id === selectedUserId ? { ...u, [field]: value } : u))
    );
  };

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('You cannot delete the only remaining admin user.');
      return;
    }
    const filtered = users.filter((u) => u.id !== id);
    setUsers(filtered);
    if (filtered.length > 0) setSelectedUserId(filtered[0].id);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-red-600" /> Administrative User Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Provision staff user accounts, assign RBAC editorial roles, and manage system privileges.
          </p>
        </div>

        <button
          onClick={() => alert('User management privileges updated!')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2"
        >
          <FaFloppyDisk /> Save User Roles
        </button>
      </div>

      {loadError && (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: User List & Search (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-between items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" size={12} />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-800"
            >
              <option value="ALL">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Senior Editor">Senior Editor</option>
              <option value="Sub-Editor">Sub-Editor</option>
              <option value="Reporter">Reporter</option>
              <option value="Ad Manager">Ad Manager</option>
            </select>
          </div>

          {/* User Cards Grid */}
          <div className="space-y-2">
            {loadingUsers ? (
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                Loading users...
              </div>
            ) : filteredUsers.length > 0 ? filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  selectedUserId === u.id
                    ? 'border-red-500 bg-red-50/20 shadow-sm ring-1 ring-red-500'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-900 text-white font-black text-sm flex items-center justify-center shrink-0 border">
                    {u.name.charAt(0)}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-xs text-gray-800 block truncate">{u.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono block truncate">{u.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="bg-gray-100 text-gray-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                    {u.role}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUserStatus(u.id);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold transition ${
                      u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {u.status}
                  </button>
                </div>
              </div>
            )) : (
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                No users match this search or role filter.
              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANEL: Add User Form & Active User Inspector (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Add New Staff Form */}
          <form onSubmit={handleAddUser} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
              <FaUserPlus className="text-red-600" /> Register New Editorial Staff
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name (Bengali/English)</label>
                <input
                  type="text"
                  placeholder="যেমন: আসিফ মাহমুদ"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="asif@24ghonta.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                >
                  <option value="Reporter">Reporter</option>
                  <option value="Sub-Editor">Sub-Editor</option>
                  <option value="Senior Editor">Senior Editor</option>
                  <option value="Ad Manager">Ad Manager</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs py-2.5 flex items-center justify-center gap-1.5 shadow transition"
              >
                <FaUserPlus /> Provision Account
              </button>
            </div>
          </form>

          {/* Active User Settings Inspector */}
          {activeUser && (
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 sticky top-6">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FaShieldHalved className="text-red-600" /> Staff Role & Security Settings
                </h2>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(activeUser.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition"
                  title="Remove Staff User"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Staff Name</label>
                  <input
                    type="text"
                    value={activeUser.name}
                    onChange={(e) => updateActiveUser('name', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Account</label>
                  <input
                    type="email"
                    value={activeUser.email}
                    onChange={(e) => updateActiveUser('email', e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">System Privilege Role</label>
                  <select
                    value={activeUser.role}
                    onChange={(e) => updateActiveUser('role', e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg font-bold text-red-600"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Senior Editor">Senior Editor</option>
                    <option value="Sub-Editor">Sub-Editor</option>
                    <option value="Reporter">Reporter</option>
                    <option value="Ad Manager">Ad Manager</option>
                  </select>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => alert(`Password reset email sent to ${activeUser.email}`)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1.5"
                  >
                    <FaKey size={10} /> Reset Password
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleUserStatus(activeUser.id)}
                    className={`text-[10px] font-bold px-3 py-1 rounded-full transition ${
                      activeUser.status === 'ACTIVE' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {activeUser.status === 'ACTIVE' ? 'SUSPEND USER' : 'ACTIVATE USER'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}