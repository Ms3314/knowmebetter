import { render } from '@react-email/render';
import React from 'react';

/**
 * Converts a React Email component to HTML string for use with Nodemailer
 * @param component The React Email component to render
 * @returns HTML string representation of the email
 */
export function renderReactEmailToHtml(component: React.ReactElement): Promise<string> {
  return render(component);
} 