import nodemailer from "nodemailer";
import { Appointment, Client, Pet, Groomer, User, Business } from "@prisma/client";

// Email templates
const emailTemplates = {
  appointmentConfirmation: (data: {
    clientName: string;
    petName: string;
    groomerName: string;
    serviceName: string;
    date: string;
    time: string;
    businessName: string;
    businessPhone?: string;
    businessAddress?: string;
    notes?: string;
  }) => ({
    subject: `Appointment Confirmed - ${data.businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c19a7e; margin: 0; font-size: 28px;">🐕 BarkBook</h1>
            <h2 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">Appointment Confirmed!</h2>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Appointment Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div><strong>Date:</strong> ${data.date}</div>
              <div><strong>Time:</strong> ${data.time}</div>
              <div><strong>Pet:</strong> ${data.petName}</div>
              <div><strong>Service:</strong> ${data.serviceName}</div>
              <div><strong>Groomer:</strong> ${data.groomerName}</div>
              <div><strong>Business:</strong> ${data.businessName}</div>
            </div>
          </div>
          
          ${data.notes ? `
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">Special Notes</h4>
              <p style="color: #856404; margin: 0; font-size: 14px;">${data.notes}</p>
            </div>
          ` : ''}
          
          <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
            <h4 style="color: #155724; margin: 0 0 10px 0; font-size: 16px;">What to Expect</h4>
            <ul style="color: #155724; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Please arrive 5-10 minutes before your appointment</li>
              <li>Bring any special treats or toys your pet loves</li>
              <li>Let us know if your pet has any special needs</li>
            </ul>
          </div>
          
          ${data.businessPhone || data.businessAddress ? `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
              <h4 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Contact Information</h4>
              ${data.businessPhone ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${data.businessPhone}</p>` : ''}
              ${data.businessAddress ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${data.businessAddress}</p>` : ''}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0; font-size: 12px;">
              Thank you for choosing ${data.businessName}!<br>
              If you need to reschedule or cancel, please contact us as soon as possible.
            </p>
          </div>
        </div>
      </div>
    `
  }),

  appointmentReminder: (data: {
    clientName: string;
    petName: string;
    groomerName: string;
    serviceName: string;
    date: string;
    time: string;
    businessName: string;
    businessPhone?: string;
  }) => ({
    subject: `Reminder: Your appointment tomorrow - ${data.businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c19a7e; margin: 0; font-size: 28px;">🐕 BarkBook</h1>
            <h2 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">Appointment Reminder</h2>
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">Tomorrow's Appointment</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; color: #856404;">
              <div><strong>Date:</strong> ${data.date}</div>
              <div><strong>Time:</strong> ${data.time}</div>
              <div><strong>Pet:</strong> ${data.petName}</div>
              <div><strong>Service:</strong> ${data.serviceName}</div>
              <div><strong>Groomer:</strong> ${data.groomerName}</div>
              <div><strong>Business:</strong> ${data.businessName}</div>
            </div>
          </div>
          
          <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
            <h4 style="color: #155724; margin: 0 0 10px 0; font-size: 16px;">Reminder Checklist</h4>
            <ul style="color: #155724; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Set aside enough time for the appointment</li>
              <li>Bring any special treats or toys</li>
              <li>Note any special instructions for your pet</li>
              <li>Have your contact information ready</li>
            </ul>
          </div>
          
          ${data.businessPhone ? `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
              <h4 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Need to Reschedule?</h4>
              <p style="color: #333; margin: 0; font-size: 14px;">
                Please call us at <strong>${data.businessPhone}</strong> as soon as possible if you need to reschedule or cancel.
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0; font-size: 12px;">
              We look forward to seeing you and ${data.petName} tomorrow!<br>
              ${data.businessName}
            </p>
          </div>
        </div>
      </div>
    `
  }),

  appointmentCancellation: (data: {
    clientName: string;
    petName: string;
    date: string;
    time: string;
    businessName: string;
    businessPhone?: string;
  }) => ({
    subject: `Appointment Cancelled - ${data.businessName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c19a7e; margin: 0; font-size: 28px;">🐕 BarkBook</h1>
            <h2 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">Appointment Cancelled</h2>
          </div>
          
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #721c24; margin: 0 0 15px 0; font-size: 18px;">Cancelled Appointment</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; color: #721c24;">
              <div><strong>Date:</strong> ${data.date}</div>
              <div><strong>Time:</strong> ${data.time}</div>
              <div><strong>Pet:</strong> ${data.petName}</div>
              <div><strong>Business:</strong> ${data.businessName}</div>
            </div>
          </div>
          
          <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
            <h4 style="color: #155724; margin: 0 0 10px 0; font-size: 16px;">Reschedule Your Appointment</h4>
            <p style="color: #155724; margin: 0; font-size: 14px;">
              We'd be happy to help you reschedule your appointment. Please contact us to find a new time that works for you.
            </p>
          </div>
          
          ${data.businessPhone ? `
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
              <h4 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Contact Us</h4>
              <p style="color: #333; margin: 0; font-size: 14px;">
                Call us at <strong>${data.businessPhone}</strong> to reschedule or book a new appointment.
              </p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0; font-size: 12px;">
              Thank you for your understanding.<br>
              ${data.businessName}
            </p>
          </div>
        </div>
      </div>
    `
  }),

  welcomeEmail: (data: {
    clientName: string;
    businessName: string;
    businessPhone?: string;
    businessAddress?: string;
  }) => ({
    subject: `Welcome to ${data.businessName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c19a7e; margin: 0; font-size: 28px;">🐕 BarkBook</h1>
            <h2 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">Welcome to ${data.businessName}!</h2>
          </div>
          
          <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px;">Welcome ${data.clientName}!</h3>
            <p style="color: #155724; margin: 0; font-size: 14px; line-height: 1.6;">
              Thank you for choosing ${data.businessName} for your pet's grooming needs. We're excited to have you as part of our family!
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
            <h4 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">What to Expect</h4>
            <ul style="color: #333; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Professional and caring grooming services</li>
              <li>Before and after photos of your pet</li>
              <li>Appointment reminders and updates</li>
              <li>Easy online booking and rescheduling</li>
            </ul>
          </div>
          
          ${data.businessPhone || data.businessAddress ? `
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">Contact Information</h4>
              ${data.businessPhone ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> ${data.businessPhone}</p>` : ''}
              ${data.businessAddress ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Address:</strong> ${data.businessAddress}</p>` : ''}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0; font-size: 12px;">
              We look forward to providing excellent care for your furry friend!<br>
              The ${data.businessName} Team
            </p>
          </div>
        </div>
      </div>
    `
  })
};

// Email transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter!;
}

// Email sending functions
export async function sendAppointmentConfirmation(
  appointment: Appointment & {
    client: Client;
    pet: Pet;
    groomer: Groomer & { user: User };
    service?: { name: string } | null;
  },
  business: Business
) {
  if (!appointment.client.email || !process.env.SMTP_HOST) {
    return;
  }

  const emailData = {
    clientName: appointment.client.name,
    petName: appointment.pet.name,
    groomerName: appointment.groomer.user.name || "Our groomer",
    serviceName: appointment.service?.name || "Grooming service",
    date: appointment.start.toLocaleDateString(),
    time: appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    businessName: business.name,
    businessPhone: business.phone || undefined,
    businessAddress: business.address ? `${business.address}, ${business.city}, ${business.state}` : undefined,
    notes: appointment.notes || undefined,
  };

  const { subject, html } = emailTemplates.appointmentConfirmation(emailData);

  try {
    await getTransporter().sendMail({
      from: process.env.FROM_EMAIL,
      to: appointment.client.email,
      subject,
      html,
    });
    console.log(`Appointment confirmation sent to ${appointment.client.email}`);
  } catch (error) {
    console.error("Failed to send appointment confirmation:", error);
  }
}

export async function sendAppointmentReminder(
  appointment: Appointment & {
    client: Client;
    pet: Pet;
    groomer: Groomer & { user: User };
    service?: { name: string } | null;
  },
  business: Business
) {
  if (!appointment.client.email || !process.env.SMTP_HOST) {
    return;
  }

  const emailData = {
    clientName: appointment.client.name,
    petName: appointment.pet.name,
    groomerName: appointment.groomer.user.name || "Our groomer",
    serviceName: appointment.service?.name || "Grooming service",
    date: appointment.start.toLocaleDateString(),
    time: appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    businessName: business.name,
    businessPhone: business.phone || undefined,
  };

  const { subject, html } = emailTemplates.appointmentReminder(emailData);

  try {
    await getTransporter().sendMail({
      from: process.env.FROM_EMAIL,
      to: appointment.client.email,
      subject,
      html,
    });
    console.log(`Appointment reminder sent to ${appointment.client.email}`);
  } catch (error) {
    console.error("Failed to send appointment reminder:", error);
  }
}

export async function sendAppointmentCancellation(
  appointment: Appointment & {
    client: Client;
    pet: Pet;
  },
  business: Business
) {
  if (!appointment.client.email || !process.env.SMTP_HOST) {
    return;
  }

  const emailData = {
    clientName: appointment.client.name,
    petName: appointment.pet.name,
    date: appointment.start.toLocaleDateString(),
    time: appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    businessName: business.name,
    businessPhone: business.phone || undefined,
  };

  const { subject, html } = emailTemplates.appointmentCancellation(emailData);

  try {
    await getTransporter().sendMail({
      from: process.env.FROM_EMAIL,
      to: appointment.client.email,
      subject,
      html,
    });
    console.log(`Appointment cancellation sent to ${appointment.client.email}`);
  } catch (error) {
    console.error("Failed to send appointment cancellation:", error);
  }
}

export async function sendWelcomeEmail(
  client: Client,
  business: Business
) {
  if (!client.email || !process.env.SMTP_HOST) {
    return;
  }

  const emailData = {
    clientName: client.name,
    businessName: business.name,
    businessPhone: business.phone || undefined,
    businessAddress: business.address ? `${business.address}, ${business.city}, ${business.state}` : undefined,
  };

  const { subject, html } = emailTemplates.welcomeEmail(emailData);

  try {
    await getTransporter().sendMail({
      from: process.env.FROM_EMAIL,
      to: client.email,
      subject,
      html,
    });
    console.log(`Welcome email sent to ${client.email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

// Utility function to check if email is configured
export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.FROM_EMAIL);
}
