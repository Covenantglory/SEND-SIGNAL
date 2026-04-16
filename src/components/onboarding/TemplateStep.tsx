'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from './steps.module.css';

interface TemplateStepProps {
  onNext: () => void;
  onDataChange: (data: { id: string; name: string } | null) => void;
}

const PLACEHOLDERS = [
  { label: 'First Name', value: '{{first_name}}' },
  { label: 'Last Name', value: '{{last_name}}' },
  { label: 'Full Name', value: '{{full_name}}' },
  { label: 'Email', value: '{{email}}' },
  { label: 'Source', value: '{{source}}' },
];

export function TemplateStep({ onNext, onDataChange }: TemplateStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    body: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const insertPlaceholder = (placeholder: string) => {
    setFormData((prev) => ({
      ...prev,
      body: prev.body + placeholder,
    }));
  };

  const getPreview = () => {
    let preview = formData.body;
    preview = preview.replace(/\{\{first_name\}\}/g, 'John');
    preview = preview.replace(/\{\{last_name\}\}/g, 'Doe');
    preview = preview.replace(/\{\{full_name\}\}/g, 'John Doe');
    preview = preview.replace(/\{\{email\}\}/g, 'john@example.com');
    preview = preview.replace(/\{\{source\}\}/g, 'Website');
    return preview;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create template');
        return;
      }

      onDataChange({ id: data.id, name: formData.name });
      onNext();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.step}>
      <h1 className={styles.title}>Create Your First Template</h1>
      <p className={styles.description}>
        Build a message template with placeholders for personalization.
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Template Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Welcome Message"
          required
        />

        <div className={styles.textareaWrapper}>
          <label className={styles.label}>Message Body</label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Hi {{first_name}}, welcome to..."
            rows={6}
            required
          />
        </div>

        <div className={styles.placeholderToolbar}>
          <span className={styles.toolbarLabel}>Insert placeholders:</span>
          <div className={styles.placeholderButtons}>
            {PLACEHOLDERS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => insertPlaceholder(p.value)}
                className={styles.placeholderButton}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.preview}>
          <h4 className={styles.previewTitle}>Preview</h4>
          <div className={styles.previewContent}>{getPreview() || 'Your message preview will appear here...'}</div>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Create Template
        </Button>
      </form>
    </div>
  );
}
