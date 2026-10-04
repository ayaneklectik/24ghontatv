'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminRequest } from '@/lib/admin-api';
import { resolveMediaUrl, retryAlternateMediaHost } from '@/lib/urls';

type AccountSection = 'profile' | 'avatar' | 'password';

type AccountProfile = {
  id: string;
  name: string;
  email: string;
  contact: string;
  user_type: string;
  status: number | string | boolean;
  photo: string;
};

function unwrapUser(payload: any): any {
  return payload?.data?.user ?? payload?.data ?? payload?.user ?? payload;
}

function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('Could not read the selected image.'));
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

const sectionDetails: Record<AccountSection, { title: string; description: string }> = {
  profile: { title: 'Edit Profile', description: 'Update your account details.' },
  avatar: { title: 'Change Avatar', description: 'Upload a new profile photo.' },
  password: { title: 'Change Password', description: 'Set a new password for your account.' },
};

export default function AccountSettings({ section }: { section: AccountSection }) {
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        const payload = await adminRequest<any>('/me');
        const user = unwrapUser(payload);
        if (!user?.id) throw new Error('Could not identify the signed-in account.');
        if (active) {
          setProfile({
            id: String(user.id),
            name: String(user.name ?? ''),
            email: String(user.email ?? ''),
            contact: String(user.contact ?? ''),
            user_type: String(user.user_type ?? 'Admin'),
            status: user.status ?? 1,
            photo: String(user.photo ?? ''),
          });
        }
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load your account.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await adminRequest(`/users/${encodeURIComponent(profile.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name.trim(),
          email: profile.email.trim(),
          contact: profile.contact.trim(),
          user_type: profile.user_type,
          status: profile.status,
        }),
      });
      setSuccess('Profile updated successfully.');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  }

  async function saveAvatar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !selectedImage) {
      setError('Choose an image first.');
      return;
    }
    if (selectedImage.size > 5 * 1024 * 1024) {
      setError('The image must be 5 MB or smaller.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedImage.type)) {
      setError('Choose a JPG, PNG, or WebP image.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const extension = selectedImage.type === 'image/png' ? 'png' : selectedImage.type === 'image/webp' ? 'webp' : 'jpg';
      const photoName = `user_${profile.id}_${Date.now()}.${extension}`;
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('contact', profile.contact);
      formData.append('user_type', profile.user_type);
      formData.append('status', String(profile.status));
      formData.append('image', photoName);
      formData.append('imageUpload', selectedImage);
      formData.append('base64image', await imageToDataUrl(selectedImage));
      formData.append('_method', 'PUT');

      await adminRequest(`/users/${encodeURIComponent(profile.id)}`, {
        method: 'POST',
        body: formData,
      });
      setProfile({ ...profile, photo: photoName });
      setSelectedImage(null);
      setImagePreview(null);
      setSuccess('Avatar updated successfully.');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not update your avatar.');
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await adminRequest(`/users/${encodeURIComponent(profile.id)}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirm_password: confirmPassword }),
      });
      setPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not change your password.');
    } finally {
      setSaving(false);
    }
  }

  const details = sectionDetails[section];
  const avatarUrl = profile?.photo
    ? resolveMediaUrl(`images/user_image/thumbnail/${profile.photo}`, '')
    : null;

  return (
    <main className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{details.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{details.description}</p>
        </div>
        <Link href="/admin/dashboard" className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
          Back to dashboard
        </Link>
      </div>

      <nav aria-label="Account settings" className="flex gap-4 border-b border-gray-200 text-sm">
        <Link href="/admin/profile" aria-current={section === 'profile' ? 'page' : undefined} className={`border-b-2 px-1 pb-3 ${section === 'profile' ? 'border-red-600 font-semibold text-red-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
          Profile
        </Link>
        <Link href="/admin/profile/avatar" aria-current={section === 'avatar' ? 'page' : undefined} className={`border-b-2 px-1 pb-3 ${section === 'avatar' ? 'border-red-600 font-semibold text-red-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
          Avatar
        </Link>
        <Link href="/admin/profile/password" aria-current={section === 'password' ? 'page' : undefined} className={`border-b-2 px-1 pb-3 ${section === 'password' ? 'border-red-600 font-semibold text-red-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
          Password
        </Link>
      </nav>

      {error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div role="status" className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Loading account...</div>
      ) : profile ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          {section === 'profile' && (
            <form onSubmit={saveProfile} className="space-y-5">
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Full name</span>
                <input required maxLength={255} value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Email address</span>
                <input type="email" required maxLength={255} value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Contact number</span>
                <input value={profile.contact} onChange={(event) => setProfile({ ...profile, contact: event.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" />
              </label>
              <button type="submit" disabled={saving} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save profile'}
              </button>
            </form>
          )}

          {section === 'avatar' && (
            <form onSubmit={saveAvatar} className="space-y-5">
              <div className="flex items-center gap-4">
                {imagePreview || avatarUrl ? (
                  <img
                    src={imagePreview ?? avatarUrl ?? undefined}
                    alt="Account avatar preview"
                    className="h-20 w-20 rounded-full border border-gray-200 bg-gray-50 object-cover"
                    onError={(event) => {
                      if (!imagePreview) {
                        retryAlternateMediaHost(event.currentTarget);
                      }
                    }}
                  />
                ) : (
                  <div aria-label="Account avatar placeholder" className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-2xl font-semibold text-gray-600">
                    {profile.name.trim().charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                  <p className="text-xs text-gray-500">JPG, PNG, or WebP. Maximum 5 MB.</p>
                </div>
              </div>
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Select image</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedImage(file);
                  setImagePreview(file ? URL.createObjectURL(file) : null);
                }} className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-red-50 file:px-3 file:py-2 file:font-medium file:text-red-700 hover:file:bg-red-100" />
              </label>
              <button type="submit" disabled={saving || !selectedImage} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {saving ? 'Uploading...' : 'Save avatar'}
              </button>
            </form>
          )}

          {section === 'password' && (
            <form onSubmit={savePassword} className="space-y-5">
              <p className="text-sm text-gray-600">Changing your password will apply the next time you sign in.</p>
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>New password</span>
                <input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-gray-700">
                <span>Confirm new password</span>
                <input type="password" required minLength={6} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100" />
              </label>
              <button type="submit" disabled={saving} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {saving ? 'Updating...' : 'Change password'}
              </button>
            </form>
          )}
        </section>
      ) : null}
    </main>
  );
}