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
  appointmentConfirmation: (appointment: Record<string, unknown>, pets: Record<string, unknown>[]) => {
    const petNames = pets.map(pet => (pet as { name: string }).name).join(', ')
    return `Your appointment for ${petNames} has been confirmed for ${new Date(appointment.start_at as string).toLocaleString()}. Please arrive 5 minutes early. Reply STOP to unsubscribe.`
  },
  
  appointmentReminder: (appointment: Record<string, unknown>, pets: Record<string, unknown>[]) => {
    const petNames = pets.map(pet => (pet as { name: string }).name).join(', ')
    return `Reminder: Your appointment for ${petNames} is tomorrow at ${new Date(appointment.start_at as string).toLocaleTimeString()}. Please confirm by replying YES or cancel by replying NO.`
  },
  
  appointmentCancelled: (appointment: Record<string, unknown>, pets: Record<string, unknown>[]) => {
    const petNames = pets.map(pet => (pet as { name: string }).name).join(', ')
    return `Your appointment for ${petNames} on ${new Date(appointment.start_at as string).toLocaleDateString()} has been cancelled. Please contact us to reschedule.`
  },
  
  vaccineReminder: (pet: Record<string, unknown>, vaccine: Record<string, unknown>) => {
    return `Reminder: ${(pet as { name: string }).name}'s ${(vaccine as { name: string }).name} vaccine expires on ${new Date((vaccine as { expires_on: string }).expires_on).toLocaleDateString()}. Please upload updated records or contact us.`
  },
  
  etaUpdate: (eta: string, location: string) => {
    return `ETA update: We'll arrive at ${location} in approximately ${eta}. Please ensure your pet is ready.`
  },
  
  paymentLink: (amount: number, link: string) => {
    return `Payment request: $${(amount / 100).toFixed(2)} for your appointment. Pay securely at: ${link}`
  }
}
