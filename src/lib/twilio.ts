import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const phoneNumber = process.env.TWILIO_PHONE_NUMBER!

export const twilioClient = twilio(accountSid, authToken)

// SMS message types
export type SendSMSParams = {
  to: string
  body: string
  from?: string
}

export type SendMMSParams = {
  to: string
  body: string
  mediaUrl: string[]
  from?: string
}

// Message status types
export type MessageStatus = 
  | 'accepted'
  | 'queued'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'delivered'
  | 'undelivered'

// SMS service functions
export const sendSMS = async ({ to, body, from = phoneNumber }: SendSMSParams) => {
  try {
    const message = await twilioClient.messages.create({
      body,
      from,
      to,
    })
    
    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('SMS sending failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const sendMMS = async ({ to, body, mediaUrl, from = phoneNumber }: SendMMSParams) => {
  try {
    const message = await twilioClient.messages.create({
      body,
      from,
      to,
      mediaUrl,
    })
    
    return {
      success: true,
      messageId: message.sid,
      status: message.status,
    }
  } catch (error) {
    console.error('MMS sending failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Message templates
export const messageTemplates = {
  appointmentConfirmation: (appointment: any, pets: any[]) => {
    const petNames = pets.map(pet => pet.name).join(', ')
    return `Your appointment for ${petNames} has been confirmed for ${new Date(appointment.start_at).toLocaleString()}. Please arrive 5 minutes early. Reply STOP to unsubscribe.`
  },
  
  appointmentReminder: (appointment: any, pets: any[]) => {
    const petNames = pets.map(pet => pet.name).join(', ')
    return `Reminder: Your appointment for ${petNames} is tomorrow at ${new Date(appointment.start_at).toLocaleTimeString()}. Please confirm by replying YES or cancel by replying NO.`
  },
  
  appointmentCancelled: (appointment: any, pets: any[]) => {
    const petNames = pets.map(pet => pet.name).join(', ')
    return `Your appointment for ${petNames} on ${new Date(appointment.start_at).toLocaleDateString()} has been cancelled. Please contact us to reschedule.`
  },
  
  vaccineReminder: (pet: any, vaccine: any) => {
    return `Reminder: ${pet.name}'s ${vaccine.name} vaccine expires on ${new Date(vaccine.expires_on).toLocaleDateString()}. Please upload updated records or contact us.`
  },
  
  etaUpdate: (eta: string, location: string) => {
    return `ETA update: We'll arrive at ${location} in approximately ${eta}. Please ensure your pet is ready.`
  },
  
  paymentLink: (amount: number, link: string) => {
    return `Payment request: $${(amount / 100).toFixed(2)} for your appointment. Pay securely at: ${link}`
  }
}
