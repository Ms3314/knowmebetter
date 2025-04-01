import { render } from '@react-email/render';
import React from 'react';

/**
 * Converts a React Email component to HTML string for use with Nodemailer
 * @param component The React Email component to render
 * @returns HTML string representation of the email
 */
export async function renderReactEmailToHtml(component: React.ReactElement): Promise<string> {
  try {
    // Render the React Email component to HTML
    const html = await render(component);
    
    // Clean up any problematic HTML that might cause issues with email clients
    // This helps with compatibility across different email providers like Gmail and Outlook
    const cleanedHtml = html
      // Ensure proper DOCTYPE declaration for better email client compatibility
      .replace(/<!DOCTYPE[^>]*>/i, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">')
      // Add additional meta tags for better Outlook rendering
      .replace(/<head>/i, '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />')
      // Replace problematic CSS that might not work in email clients
      .replace(/display\s*:\s*flex/g, 'display: block')
      .replace(/display\s*:\s*grid/g, 'display: block');
    
    return cleanedHtml;
  } catch (error) {
    console.error('Error rendering React Email component:', error);
    throw error;
  }
} 