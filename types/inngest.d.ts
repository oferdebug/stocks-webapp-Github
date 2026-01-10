import { Inngest } from 'inngest';

declare global {
  // This augments the existing 'global' declaration
  var inngest: Inngest;
}

declare module '@/lib/db' {
  export const db: {
    user: {
      findMany: (args: any) => Promise<Array<{
        email: string;
        name: string | null;
      }>>;
    };
  };
}

declare module '@/lib/emails/email-service' {
  export function sendEmail(args: {
    to: string;
    from: string;
    subject: string;
    html: string;
  }): Promise<any>;
}

declare module '@/lib/emails/email-templates' {
  export const NEWS_SUMMARY_EMAIL_TEMPLATE: string;
}

// Add types for Inngest step function
type InngestStep = {
  run<T = any>(name: string, fn: () => Promise<T>): Promise<T>;
};
