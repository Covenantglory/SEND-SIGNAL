'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/shared/empty-state';
import styles from './templates.module.css';

interface Template {
  id: string;
  name: string;
  body: string;
  version: number;
  createdAt: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Message Templates</h2>
        <Button onClick={() => setShowCreateModal(true)}>Create Template</Button>
      </div>

      {templates.length === 0 && !loading ? (
        <EmptyState
          title="No templates yet"
          description="Create your first message template with personalized placeholders."
          actionLabel="Create Template"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className={styles.grid}>
          {templates.map((template) => (
            <Card key={template.id} className={styles.templateCard}>
              <div className={styles.templateHeader}>
                <h3 className={styles.templateName}>{template.name}</h3>
                <span className={styles.templateVersion}>v{template.version}</span>
              </div>
              <p className={styles.templateBody}>{template.body}</p>
              <div className={styles.templateFooter}>
                <span className={styles.templateDate}>
                  {new Date(template.createdAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={fetchTemplates}
      />
    </div>
  );
}

function CreateTemplateModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [formData, setFormData] = useState({ name: '', body: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onCreate();
        setFormData({ name: '', body: '' });
        onClose();
      }
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Template" size="lg">
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Template Name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Welcome Message"
          required
        />

        <div className={styles.textareaWrapper}>
          <label className={styles.label}>Message Body</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
            className={styles.textarea}
            placeholder="Hi {{first_name}}, ..."
            rows={6}
            required
          />
        </div>

        <div className={styles.actions}>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Template
          </Button>
        </div>
      </form>
    </Modal>
  );
}
