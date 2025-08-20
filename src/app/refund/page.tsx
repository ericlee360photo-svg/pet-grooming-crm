import Link from "next/link"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">BarkBook</span>
            </Link>
            <Link href="/" className="text-accent hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">1. Overview</h2>
              <p className="text-gray-700 mb-4">
                At BarkBook, we strive to provide exceptional service to all our customers. This refund policy outlines the terms and conditions for refunds of our subscription services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">2. Subscription Refunds</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Free Trial Period</h3>
              <p className="text-gray-700 mb-4">
                We offer a 14-day free trial for all new customers. During this period, you can cancel your subscription at any time without being charged.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Paid Subscriptions</h3>
              <p className="text-gray-700 mb-4">
                After the free trial period, subscriptions are billed monthly or annually in advance. Refunds for paid subscriptions are handled as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>First 30 days:</strong> Full refund available for any reason</li>
                <li><strong>After 30 days:</strong> Pro-rated refund for unused portion of billing period</li>
                <li><strong>Annual subscriptions:</strong> Pro-rated refund for remaining months</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">3. Refund Eligibility</h2>
              <p className="text-gray-700 mb-4">
                Refunds may be granted in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Technical issues preventing use of the service</li>
                <li>Service unavailability for extended periods</li>
                <li>Billing errors or duplicate charges</li>
                <li>Unsatisfactory service quality</li>
                <li>Account cancellation within the refund period</li>
              </ul>
              
              <p className="text-gray-700 mb-4">
                Refunds will not be granted for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violation of our Terms of Service</li>
                <li>Fraudulent activity or abuse</li>
                <li>Change of mind after extended use</li>
                <li>Failure to cancel before billing cycle</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">4. How to Request a Refund</h2>
              <p className="text-gray-700 mb-4">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 mb-4">
                <li>Contact our support team at support@barkbook.com</li>
                <li>Include your account email and reason for refund</li>
                <li>Provide any relevant details about the issue</li>
                <li>Allow 3-5 business days for review and processing</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">5. Refund Processing</h2>
              <p className="text-gray-700 mb-4">
                Once approved, refunds will be processed as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                <li><strong>Bank Transfers:</strong> 3-5 business days</li>
                <li><strong>Digital Wallets:</strong> 1-3 business days</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Refunds will be issued to the original payment method used for the purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">6. Account Cancellation</h2>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time through your account settings. Upon cancellation:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your account will remain active until the end of the current billing period</li>
                <li>No further charges will be made</li>
                <li>You may request a refund if eligible</li>
                <li>Your data will be retained for 30 days after cancellation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">7. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you disagree with a refund decision, you may:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Request a review by our management team</li>
                <li>Provide additional documentation or evidence</li>
                <li>Contact us for further discussion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">8. Chargebacks</h2>
              <p className="text-gray-700 mb-4">
                We strongly encourage customers to contact us directly for refund requests rather than initiating chargebacks. Chargebacks may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Account suspension or termination</li>
                <li>Inability to use our services in the future</li>
                <li>Additional processing fees</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">9. Currency and Exchange Rates</h2>
              <p className="text-gray-700 mb-4">
                All refunds will be processed in the original currency of the transaction. Exchange rate fluctuations may affect the final refund amount for international customers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting. Continued use of our services constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund requests or questions about this policy, please contact us:
              </p>
              <p className="text-gray-700 mb-4">
                Email: support@barkbook.com<br />
                Phone: [Your Phone Number]<br />
                Hours: Monday - Friday, 9 AM - 6 PM EST<br />
                Response Time: Within 24 hours
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-primary mb-4">12. Legal Compliance</h2>
              <p className="text-gray-700 mb-4">
                This refund policy complies with applicable consumer protection laws and regulations. Your statutory rights are not affected by this policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
