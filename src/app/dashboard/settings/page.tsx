'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/shared/toast';
import styles from './settings.module.css';

interface WhatsAppAccount {
  id: string;
  accountName: string;
  phoneNumberId: string;
  businessAccountId: string;
  displayPhoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    accountName: '',
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    displayPhoneNumber: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/settings/accounts');
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('WhatsApp account connected successfully', 'success');
        fetchAccounts();
        setShowAddForm(false);
        setFormData({
          accountName: '',
          phoneNumberId: '',
          businessAccountId: '',
          accessToken: '',
          displayPhoneNumber: '',
        });
      } else {
        showToast('Failed to connect WhatsApp account', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.accountCard}>
        <CardHeader>
          <CardTitle>WhatsApp Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 && !loading ? (
            <div className={styles.emptyState}>
              <p>No WhatsApp accounts connected yet.</p>
              <Button onClick={() => setShowAddForm(true)}>Connect Account</Button>
            </div>
          ) : (
            <div className={styles.accountList}>
              {accounts.map((account) => (
                <div key={account.id} className={styles.accountItem}>
                  <div className={styles.accountInfo}>
                    <span className={styles.accountName}>{account.accountName}</span>
                    <span className={styles.accountPhone}>
                      {account.displayPhoneNumber || account.phoneNumberId}
                    </span>
                  </div>
                  <span className={`${styles.accountStatus} ${account.isActive ? styles.active : ''}`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
              <Button variant="outline" onClick={() => setShowAddForm(true)}>
                Add Another Account
              </Button>
            </div>
          )}

          {showAddForm && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Account Name"
                value={formData.accountName}
                onChange={(e) => setFormData((prev) => ({ ...prev, accountName: e.target.value }))}
                placeholder="My Business WhatsApp"
                required
              />
              <Input
                label="Phone Number ID"
                value={formData.phoneNumberId}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumberId: e.target.value }))}
                required
              />
              <Input
                label="Business Account ID"
                value={formData.businessAccountId}
                onChange={(e) => setFormData((prev) => ({ ...prev, businessAccountId: e.target.value }))}
                required
              />
              <Input
                label="Access Token"
                type="password"
                value={formData.accessToken}
                onChange={(e) => setFormData((prev) => ({ ...prev, accessToken: e.target.value }))}
                required
              />
              <div className={styles.formActions}>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Connect</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
