import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail({
  to,
  barberName,
  serviceName,
  start,
  end,
  clientName,
}: {
  to: string;
  barberName: string;
  serviceName: string;
  start: string;
  end: string;
  clientName: string;
}) {
  await resend.emails.send({
    from: `Hood Barber <${process.env.FROM_EMAIL}>`,
    to,
    subject: `Bevestiging afspraak: ${serviceName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #0f172a, #1e293b); padding: 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Je afspraak is bevestigd</h1>
          <p style="color: #cbd5e1; margin: 8px 0 0 0;">Hood Barber</p>
        </div>
        <div style="padding: 32px; background: #f8fafc;">
          <p style="margin: 0 0 16px 0; color: #334155;">Beste ${clientName},</p>
          <p style="margin: 0 0 24px 0; color: #475569;">Bedankt voor je boeking. Hier zijn de details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: 600; color: #334155;">Service</td>
              <td style="padding: 12px 16px; color: #475569;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #334155; border-top: 1px solid #e2e8f0;">Kapper</td>
              <td style="padding: 12px 16px; color: #475569; border-top: 1px solid #e2e8f0;">${barberName}</td>
            </tr>
            <tr style="background: #f1f5f9;">
              <td style="padding: 12px 16px; font-weight: 600; color: #334155;">Datum & tijd</td>
              <td style="padding: 12px 16px; color: #475569;">${new Date(start).toLocaleString('nl-NL')}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #334155; border-top: 1px solid #e2e8f0;">Eindtijd</td>
              <td style="padding: 12px 16px; color: #475569; border-top: 1px solid #e2e8f0;">${new Date(end).toLocaleString('nl-NL')}</td>
            </tr>
          </table>
          <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">Kom 5 minuten van tevoren aan. Tot snel!</p>
        </div>
        <div style="padding: 24px 32px; text-align: center; color: #94a3b8; font-size: 12px; background: #f1f5f9; border-radius: 0 0 12px 12px;">
          Hood Barber • Vlissingen • 0413-123456
        </div>
      </div>
    `,
  });
}
