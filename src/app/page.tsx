export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
        <div className="text-2xl font-bold">Pawfect CRM</div>
        <nav className="space-x-6">
          <a className="text-gray-600 hover:text-gray-900" href="#features">Features</a>
          <a className="text-gray-600 hover:text-gray-900" href="/appointments">Appointments</a>
        </nav>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Pet grooming CRM to delight every client</h1>
          <p className="mt-6 text-lg text-gray-600">Manage appointments across multiple groomers, capture before/after photos, sell retail, invoice and get paid. Automatically request Google reviews.</p>
          <div className="mt-8 flex gap-4">
            <a href="/appointments" className="inline-flex items-center rounded-md bg-black px-6 py-3 text-white font-medium">Get started</a>
            <a href="#features" className="inline-flex items-center rounded-md border px-6 py-3 font-medium">Learn more</a>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="aspect-video rounded-xl border" />
        </div>
      </section>
      <section id="features" className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-8">
        {[
          {title: 'Multi-groomer calendar', desc: 'See availability and book across staff.'},
          {title: 'Before/after photos', desc: 'Attach photos to appointments.'},
          {title: 'Payments & invoicing', desc: 'Stripe-powered checkout and invoices.'},
          {title: 'Retail & discounts', desc: 'Track products, prices and sales.'},
          {title: 'Client surveys', desc: 'Collect feedback and improve service.'},
          {title: 'Google reviews', desc: 'Auto-send review link after visits.'}
        ].map((f) => (
          <div key={f.title} className="rounded-lg border p-6">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
