'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminRequest, fetchAdminUsers } from '@/lib/admin-api';
import { resolveMediaUrl, retryAlternateMediaHost } from '@/lib/urls';
import { FaBan, FaMagnifyingGlass, FaTrash, FaUserPlus, FaUsers } from 'react-icons/fa6';

type UserStatus = 'ACTIVE' | 'SUSPENDED';

interface UserMember {
  id: string;
  name: string;
  email: string;
  contact: string;
  role: string;
  status: UserStatus;
  joinedDate: string;
  articlesCount: number;
  photoUrl: string | null;
}

const fallbackAvatar = '/images/placeholder-news.svg';
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

function mapUser(user: any): UserMember {
  const createdAt = user?.created_at ?? user?.createdAt;
  const joinedDate = createdAt ? new Date(createdAt) : null;
  const rawStatus = user?.status;
  const active = rawStatus === undefined || rawStatus === null || rawStatus === true ||
    rawStatus === 1 || rawStatus === '1' || String(rawStatus).toLowerCase() === 'active';
  const photo = user?.photo_url ?? user?.photoUrl ?? user?.avatar ?? user?.photo ?? null;
  const photoPath = typeof photo === 'string' && photo && !/^(https?:|data:|blob:|\/)/i.test(photo)
    ? `images/user_image/thumbnail/${photo}`
    : photo;

  return {
    id: String(user?.id ?? ''),
    name: String(user?.name ?? 'Unnamed user'),
    email: String(user?.email ?? ''),
    contact: String(user?.contact ?? user?.phone ?? ''),
    role: String(user?.user_type ?? user?.role?.name ?? user?.role ?? 'User'),
    status: active ? 'ACTIVE' : 'SUSPENDED',
    joinedDate: joinedAtString(joinedDate),
    articlesCount: Number(user?.articles_count ?? user?.news_count ?? 0),
    photoUrl: typeof photoPath === 'string' && photoPath
      ? resolveMediaUrl(photoPath, fallbackAvatar)
      : null,
  };
}

function joinedAtString(date: Date | null): string {
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';
}

function unwrapCurrentUser(payload: any) {
  return payload?.data?.user ?? payload?.data ?? payload?.user ?? payload;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read the selected profile image.'));
    };
    reader.onerror = () => reject(new Error('Could not read the selected profile image.'));
    reader.readAsDataURL(file);
  });
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserMember[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actingOnUser, setActingOnUser] = useState('');
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState('Representative');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const photoInput = useRef<HTMLInputElement>(null);

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? users[0] ?? null;

  const loadUsers = useCallback(async (initial = false) => {
    if (initial) setLoadingUsers(true);
    setError('');
    const [usersResult, currentUserResult] = await Promise.allSettled([
      fetchAdminUsers(),
      adminRequest<any>('/me'),
    ]);

    if (usersResult.status === 'rejected') {
      setError(usersResult.reason instanceof Error ? usersResult.reason.message : 'Could not load users.');
      if (initial) setLoadingUsers(false);
      return;
    }

    const records = [...usersResult.value];
    const currentUser = currentUserResult.status === 'fulfilled'
      ? unwrapCurrentUser(currentUserResult.value)
      : null;

    if (currentUser?.id != null) {
      const id = String(currentUser.id);
      setCurrentUserId(id);
      if (!records.some((user) => String(user?.id) === id)) records.unshift(currentUser);
    }

    const mapped = records
      .filter((user) => user?.id !== undefined && user?.id !== null)
      .map(mapUser);
    setUsers(mapped);
    setSelectedUserId((current) =>
      mapped.some((user) => user.id === current) ? current : mapped[0]?.id ?? '',
    );
    if (initial) setLoadingUsers(false);
  }, []);

  useEffect(() => {
    void loadUsers(true);
  }, [loadUsers]);

  useEffect(() => {
    if (!newPhoto) {
      setPhotoPreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(newPhoto);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [newPhoto]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return users.filter((user) =>
      !query ||
      user.name.toLocaleLowerCase().includes(query) ||
      user.email.toLocaleLowerCase().includes(query) ||
      user.contact.toLocaleLowerCase().includes(query),
    );
  }, [searchQuery, users]);

  const choosePhoto = (file?: File) => {
    setError('');
    if (!file) return;
    if (!allowedImageTypes.includes(file.type)) {
      setError('Profile images must be JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('The profile image must be 2 MB or smaller.');
      return;
    }
    setNewPhoto(file);
  };

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setStatusMessage('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.set('name', newName.trim());
      formData.set('email', newEmail.trim());
      formData.set('contact', newContact.trim());
      formData.set('password', newPassword);
      formData.set('confirm_password', confirmPassword);
      formData.set('user_type', newRole);
      formData.set('status', '1');

      if (newPhoto) {
        formData.set('imageUpload', newPhoto);
        formData.set('base64image', await readAsDataUrl(newPhoto));
      }

      await adminRequest('/users', { method: 'POST', body: formData });
      setNewName('');
      setNewEmail('');
      setNewContact('');
      setNewPassword('');
      setConfirmPassword('');
      setNewRole('Representative');
      setNewPhoto(null);
      if (photoInput.current) photoInput.current.value = '';
      setStatusMessage('User account created.');
      await loadUsers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create the user account.');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (user: UserMember) => {
    if (user.id === currentUserId) {
      setError('You cannot suspend your own account while signed in.');
      return;
    }
    setActingOnUser(user.id);
    setError('');
    setStatusMessage('');
    try {
      await adminRequest(`/users/${encodeURIComponent(user.id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: user.status === 'ACTIVE' ? 0 : 1 }),
      });
      setStatusMessage(user.status === 'ACTIVE' ? 'User account suspended.' : 'User account activated.');
      await loadUsers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not update user status.');
    } finally {
      setActingOnUser('');
    }
  };

  const deleteUser = async (user: UserMember) => {
    if (user.id === currentUserId) {
      setError('You cannot delete the account you are currently using.');
      return;
    }
    if (!window.confirm(`Permanently delete ${user.name}'s account? This cannot be undone.`)) return;

    setActingOnUser(user.id);
    setError('');
    setStatusMessage('');
    try {
      await adminRequest(`/users/${encodeURIComponent(user.id)}`, { method: 'DELETE' });
      setStatusMessage('User account deleted.');
      await loadUsers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete the user account.');
    } finally {
      setActingOnUser('');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <FaUsers className="text-red-600" /> User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">Create accounts, review staff details, temporarily suspend access, or remove accounts.</p>
      </header>

      {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {statusMessage && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</div>}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-7">
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" size={13} />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, email, or phone"
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm"
            />
          </div>

          {loadingUsers ? (
            <div role="status" className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500">Loading users…</div>
          ) : filteredUsers.length ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-white p-4 text-left transition ${
                    selectedUser?.id === user.id ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <img
                      src={user.photoUrl || fallbackAvatar}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full border bg-gray-100 object-cover"
                      onError={(event) => retryAlternateMediaHost(event.currentTarget, fallbackAvatar)}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-gray-900">{user.name}</span>
                      <span className="block truncate text-xs text-gray-500">{user.email}</span>
                      {user.contact && <span className="block truncate text-xs text-gray-500">{user.contact}</span>}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {user.status}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">No users found.</div>
          )}
        </section>

        <aside className="space-y-5 lg:col-span-5">
          <form onSubmit={handleAddUser} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 border-b pb-3 text-base font-bold text-gray-900">
              <FaUserPlus className="text-red-600" /> Add New User
            </h2>

            <label className="block text-sm font-semibold text-gray-700">
              Full name
              <input value={newName} onChange={(event) => setNewName(event.target.value)} required maxLength={255} autoComplete="name" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Email
              <input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} required autoComplete="email" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Phone number
              <input type="tel" value={newContact} onChange={(event) => setNewContact(event.target.value)} required maxLength={13} autoComplete="tel" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Account type
              <select value={newRole} onChange={(event) => setNewRole(event.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2">
                <option value="Representative">Representative</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Password
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={6} autoComplete="new-password" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>

            <label className="block text-sm font-semibold text-gray-700">
              Confirm password
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} autoComplete="new-password" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 font-normal" />
            </label>

            <div>
              <label className="block text-sm font-semibold text-gray-700" htmlFor="new-user-photo">Profile image</label>
              <input
                ref={photoInput}
                id="new-user-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  choosePhoto(event.target.files?.[0]);
                  event.target.value = '';
                }}
                className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:font-semibold"
              />
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, or WebP · maximum 2 MB.</p>
              {photoPreview && <img src={photoPreview} alt="New profile preview" className="mt-3 h-16 w-16 rounded-full border object-cover" />}
            </div>

            <button type="submit" disabled={saving || loadingUsers} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
              <FaUserPlus /> {saving ? 'Creating account…' : 'Create user'}
            </button>
          </form>

          {selectedUser && (
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="border-b pb-3 text-base font-bold text-gray-900">Selected account</h2>
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.photoUrl || fallbackAvatar}
                  alt=""
                  className="h-14 w-14 rounded-full border bg-gray-100 object-cover"
                  onError={(event) => retryAlternateMediaHost(event.currentTarget, fallbackAvatar)}
                />
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{selectedUser.name}</p>
                  <p className="truncate text-sm text-gray-600">{selectedUser.email}</p>
                  <p className="text-xs text-gray-500">{selectedUser.contact || 'No phone number'} · {selectedUser.role}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Joined: {selectedUser.joinedDate} · Articles: {selectedUser.articlesCount}</p>
              <div className="flex flex-wrap gap-2 border-t pt-3">
                <button
                  type="button"
                  disabled={actingOnUser === selectedUser.id || selectedUser.id === currentUserId}
                  onClick={() => void toggleUserStatus(selectedUser)}
                  className="inline-flex items-center gap-2 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaBan /> {actingOnUser === selectedUser.id ? 'Please wait…' : selectedUser.status === 'ACTIVE' ? 'Suspend temporarily' : 'Reactivate account'}
                </button>
                <button
                  type="button"
                  disabled={actingOnUser === selectedUser.id || selectedUser.id === currentUserId}
                  onClick={() => void deleteUser(selectedUser)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaTrash /> Delete permanently
                </button>
                {selectedUser.id === currentUserId && <span className="self-center text-xs text-gray-500">Your current account cannot be suspended or deleted here.</span>}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
