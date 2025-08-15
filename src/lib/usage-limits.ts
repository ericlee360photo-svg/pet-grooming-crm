import { prisma } from "@/lib/db";
import { PRICING_PLANS } from "./pricing";

export interface UsageLimits {
  maxGroomers: number;
  maxClients: number;
  maxAppointmentsPerMonth: number;
}

export interface CurrentUsage {
  groomersUsed: number;
  clientsUsed: number;
  appointmentsThisMonth: number;
}

export interface UsageCheck {
  allowed: boolean;
  currentUsage: CurrentUsage;
  limits: UsageLimits;
  exceeded: {
    groomers: boolean;
    clients: boolean;
    appointments: boolean;
  };
}

/**
 * Get usage limits for a business based on their subscription plan
 */
export async function getUsageLimits(businessId: string): Promise<UsageLimits | null> {
  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { planTier: true }
    });

    if (!business) return null;

    const plan = PRICING_PLANS[business.planTier as keyof typeof PRICING_PLANS];
    if (!plan) return null;

    return {
      maxGroomers: plan.maxGroomers,
      maxClients: plan.maxClients,
      maxAppointmentsPerMonth: plan.maxAppointmentsPerMonth,
    };
  } catch (error) {
    console.error("Error getting usage limits:", error);
    return null;
  }
}

/**
 * Get current usage for a business
 */
export async function getCurrentUsage(businessId: string): Promise<CurrentUsage> {
  try {
    const [groomersCount, clientsCount, appointmentsThisMonth] = await Promise.all([
      prisma.groomer.count({
        where: { businessId },
      }),
      prisma.client.count({
        where: { businessId },
      }),
      prisma.appointment.count({
        where: {
          businessId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      groomersUsed: groomersCount,
      clientsUsed: clientsCount,
      appointmentsThisMonth,
    };
  } catch (error) {
    console.error("Error getting current usage:", error);
    return {
      groomersUsed: 0,
      clientsUsed: 0,
      appointmentsThisMonth: 0,
    };
  }
}

/**
 * Check if a business can perform an action based on their usage limits
 */
export async function checkUsageLimits(
  businessId: string,
  action: 'add_groomer' | 'add_client' | 'add_appointment'
): Promise<UsageCheck> {
  try {
    const [limits, currentUsage] = await Promise.all([
      getUsageLimits(businessId),
      getCurrentUsage(businessId),
    ]);

    if (!limits) {
      return {
        allowed: false,
        currentUsage,
        limits: { maxGroomers: 0, maxClients: 0, maxAppointmentsPerMonth: 0 },
        exceeded: { groomers: true, clients: true, appointments: true },
      };
    }

    const exceeded = {
      groomers: limits.maxGroomers !== -1 && currentUsage.groomersUsed >= limits.maxGroomers,
      clients: limits.maxClients !== -1 && currentUsage.clientsUsed >= limits.maxClients,
      appointments: limits.maxAppointmentsPerMonth !== -1 && currentUsage.appointmentsThisMonth >= limits.maxAppointmentsPerMonth,
    };

    let allowed = true;
    switch (action) {
      case 'add_groomer':
        allowed = !exceeded.groomers;
        break;
      case 'add_client':
        allowed = !exceeded.clients;
        break;
      case 'add_appointment':
        allowed = !exceeded.appointments;
        break;
    }

    return {
      allowed,
      currentUsage,
      limits,
      exceeded,
    };
  } catch (error) {
    console.error("Error checking usage limits:", error);
    return {
      allowed: false,
      currentUsage: { groomersUsed: 0, clientsUsed: 0, appointmentsThisMonth: 0 },
      limits: { maxGroomers: 0, maxClients: 0, maxAppointmentsPerMonth: 0 },
      exceeded: { groomers: true, clients: true, appointments: true },
    };
  }
}

/**
 * Update usage tracking in the subscription record
 */
export async function updateUsageTracking(businessId: string): Promise<void> {
  try {
    const currentUsage = await getCurrentUsage(businessId);
    
    await prisma.subscription.updateMany({
      where: { businessId },
      data: {
        groomersUsed: currentUsage.groomersUsed,
        clientsUsed: currentUsage.clientsUsed,
        appointmentsThisMonth: currentUsage.appointmentsThisMonth,
      },
    });
  } catch (error) {
    console.error("Error updating usage tracking:", error);
  }
}

/**
 * Check if a business is on a trial and if the trial has expired
 */
export async function checkTrialStatus(businessId: string): Promise<{
  isTrial: boolean;
  trialExpired: boolean;
  daysLeft: number;
}> {
  try {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { 
        subscriptionStatus: true,
        trialEndsAt: true,
      }
    });

    if (!business) {
      return { isTrial: false, trialExpired: true, daysLeft: 0 };
    }

    const isTrial = business.subscriptionStatus === 'TRIALING';
    const now = new Date();
    const trialEnd = business.trialEndsAt;
    
    if (!isTrial || !trialEnd) {
      return { isTrial: false, trialExpired: false, daysLeft: 0 };
    }

    const trialExpired = now > trialEnd;
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return { isTrial, trialExpired, daysLeft };
  } catch (error) {
    console.error("Error checking trial status:", error);
    return { isTrial: false, trialExpired: true, daysLeft: 0 };
  }
}

/**
 * Get a user-friendly error message for exceeded limits
 */
export function getLimitErrorMessage(action: string, exceeded: any, limits: UsageLimits): string {
  if (exceeded.groomers && action === 'add_groomer') {
    return `You've reached your limit of ${limits.maxGroomers} groomer${limits.maxGroomers > 1 ? 's' : ''}. Please upgrade your plan to add more groomers.`;
  }
  
  if (exceeded.clients && action === 'add_client') {
    return `You've reached your limit of ${limits.maxClients} clients. Please upgrade your plan to add more clients.`;
  }
  
  if (exceeded.appointments && action === 'add_appointment') {
    return `You've reached your monthly limit of ${limits.maxAppointmentsPerMonth} appointments. Please upgrade your plan for unlimited appointments.`;
  }
  
  return "You've reached your plan limits. Please upgrade to continue.";
}
