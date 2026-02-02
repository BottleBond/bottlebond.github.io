'use client';

import { useState, useCallback, useId } from 'react';

export interface ContactFormProps {
  accessKey?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function ContactForm({
  accessKey,
  onSuccess,
  onError,
}: ContactFormProps) {
  const formId = useId();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setStatus('submitting');
      setErrorMessage('');

      try {
        // Sanitize inputs
        const sanitizedData = {
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          subject: sanitizeInput(formData.subject),
          message: sanitizeInput(formData.message),
        };

        // Use Web3Forms API if access key is provided
        if (accessKey) {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              access_key: accessKey,
              ...sanitizedData,
            }),
          });

          const result = await response.json();

          if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            onSuccess?.();
          } else {
            throw new Error(result.message || 'Failed to send message');
          }
        } else {
          // Demo mode - simulate success after delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          onSuccess?.();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send message';
        setStatus('error');
        setErrorMessage(message);
        onError?.(message);
      }
    },
    [formData, validateForm, accessKey, onSuccess, onError]
  );

  const resetForm = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
  }, []);

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-green-800">Message Sent!</h3>
        <p className="mt-2 text-green-700">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={resetForm}
          className="mt-4 text-sm font-medium text-green-600 hover:text-green-800"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {status === 'error' && errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor={`${formId}-name`} className="block text-sm font-medium text-deep-brown">
          Name <span className="text-burnt-sienna">*</span>
        </label>
        <input
          type="text"
          id={`${formId}-name`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={`mt-1 block w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-burnt-sienna ${
            errors.name
              ? 'border-red-300 bg-red-50'
              : 'border-cream bg-white hover:border-burnt-sienna/50'
          }`}
          disabled={status === 'submitting'}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${formId}-email`} className="block text-sm font-medium text-deep-brown">
          Email <span className="text-burnt-sienna">*</span>
        </label>
        <input
          type="email"
          id={`${formId}-email`}
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={`mt-1 block w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-burnt-sienna ${
            errors.email
              ? 'border-red-300 bg-red-50'
              : 'border-cream bg-white hover:border-burnt-sienna/50'
          }`}
          disabled={status === 'submitting'}
        />
        {errors.email && (
          <p id={`${formId}-email-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor={`${formId}-subject`} className="block text-sm font-medium text-deep-brown">
          Subject <span className="text-burnt-sienna">*</span>
        </label>
        <select
          id={`${formId}-subject`}
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? `${formId}-subject-error` : undefined}
          className={`mt-1 block w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-burnt-sienna ${
            errors.subject
              ? 'border-red-300 bg-red-50'
              : 'border-cream bg-white hover:border-burnt-sienna/50'
          }`}
          disabled={status === 'submitting'}
        >
          <option value="">Select a subject...</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Guest Appearance">Guest Appearance</option>
          <option value="Sponsorship">Sponsorship</option>
          <option value="Feedback">Feedback</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Other">Other</option>
        </select>
        {errors.subject && (
          <p id={`${formId}-subject-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${formId}-message`} className="block text-sm font-medium text-deep-brown">
          Message <span className="text-burnt-sienna">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={`mt-1 block w-full rounded-lg border px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-burnt-sienna ${
            errors.message
              ? 'border-red-300 bg-red-50'
              : 'border-cream bg-white hover:border-burnt-sienna/50'
          }`}
          disabled={status === 'submitting'}
        />
        {errors.message && (
          <p id={`${formId}-message-error`} className="mt-1 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </div>

      {!accessKey && (
        <p className="text-center text-xs text-charcoal/50">
          Demo mode: Messages are not actually sent. Configure Web3Forms access key for production.
        </p>
      )}
    </form>
  );
}
