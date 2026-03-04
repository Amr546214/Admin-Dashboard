import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { PageContainer } from '../../components/layout/PageContainer/PageContainer';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import styles from './Settings.module.css';

export function Settings() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    headline: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      addToast('Profile saved.', 'success');
      setSaving(false);
    }, 400);
  };

  return (
    <PageContainer title="Settings">
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <form className={styles.form} onSubmit={handleSave}>
          <Input
            label="Name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
          />
          <Input
            label="Headline"
            value={profile.headline}
            onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
            placeholder="Short headline"
          />
          <Input
            label="Location"
            value={profile.location}
            onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
            placeholder="City, Country"
          />
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
