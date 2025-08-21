import { NextRequest, NextResponse } from 'next/server'

// Make this route dynamic to avoid build-time execution
export const dynamic = 'force-dynamic'

interface MigrationRow {
  // Client data
  name?: string
  email?: string
  phone?: string
  address?: string
  
  // Pet data
  pet_name?: string
  pet_breed?: string
  pet_age?: string
  pet_notes?: string
  pet_weight?: string
  
  // Service/appointment data
  last_visit?: string
  next_appointment?: string
  services?: string
  notes?: string
  
  // Additional fields
  [key: string]: any
}

interface ProcessedClient {
  name: string
  email: string
  phone?: string
  address?: any
  org_id: string
}

interface ProcessedPet {
  name: string
  breed?: string
  weight_kg?: number
  notes?: string
  owner_id: string
  org_id: string
  species: string
}

export async function POST(req: NextRequest) {
  try {
    // Check if required environment variables are present
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration incomplete' },
        { status: 500 }
      )
    }

    // Import and create server client dynamically
    const { createServerSupabaseClient } = await import('@/lib/supabase')
    const supabase = createServerSupabaseClient()
    
    // For demo purposes, we'll use a default organization
    // In production, you'd get this from the authenticated user
    const organization_id = 'demo-org-123'

    // Parse the request body
    const { data }: { data: MigrationRow[] } = await req.json()
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      )
    }

    console.log(`Processing ${data.length} rows for organization ${organization_id}`)

    const results = {
      clients_created: 0,
      pets_created: 0,
      errors: [] as string[],
      skipped: 0
    }

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      try {
        // Skip empty rows
        if (!row.name && !row.email && !row.pet_name) {
          results.skipped++
          continue
        }

        // Process client data
        const clientData: ProcessedClient = {
          name: row.name || row.client_name || 'Unknown Client',
          email: row.email || `client${i}@migrated.local`,
          phone: row.phone || row.phone_number || undefined,
          address: row.address || undefined,
          org_id: organization_id
        }

        // Check if client already exists
        const { data: existingClient } = await supabase
          .from('owners')
          .select('id')
          .eq('email', clientData.email)
          .eq('org_id', organization_id)
          .single()

        let client_id: string

        if (existingClient) {
          client_id = existingClient.id
          console.log(`Client ${clientData.email} already exists`)
        } else {
          // Create new client
          const { data: newClient, error: clientError } = await supabase
            .from('owners')
            .insert([clientData])
            .select('id')
            .single()

          if (clientError) {
            results.errors.push(`Row ${i + 1}: Failed to create client - ${clientError.message}`)
            continue
          }

          client_id = newClient.id
          results.clients_created++
          console.log(`Created client: ${clientData.name}`)
        }

        // Process pet data if available
        if (row.pet_name) {
          const petData: ProcessedPet = {
            name: row.pet_name,
            breed: row.pet_breed || row.breed || undefined,
            weight_kg: row.pet_weight ? parseFloat(row.pet_weight) : undefined,
            notes: row.pet_notes || row.notes || undefined,
            owner_id: client_id,
            org_id: organization_id,
            species: 'dog' // Default to dog, can be enhanced later
          }

          // Check if pet already exists for this owner
          const { data: existingPet } = await supabase
            .from('pets')
            .select('id')
            .eq('name', petData.name)
            .eq('owner_id', client_id)
            .single()

          if (!existingPet) {
            const { error: petError } = await supabase
              .from('pets')
              .insert([petData])

            if (petError) {
              results.errors.push(`Row ${i + 1}: Failed to create pet ${petData.name} - ${petError.message}`)
            } else {
              results.pets_created++
              console.log(`Created pet: ${petData.name} for ${clientData.name}`)
            }
          } else {
            console.log(`Pet ${petData.name} already exists for ${clientData.name}`)
          }
        }

        // Add appointment data if available
        if (row.last_visit || row.next_appointment) {
          // You can extend this to create appointment records
          console.log(`Found appointment data for ${clientData.name}`)
        }

      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error)
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    console.log('Migration completed:', results)

    return NextResponse.json({
      success: true,
      message: `Migration completed successfully`,
      results: {
        total_rows: data.length,
        clients_created: results.clients_created,
        pets_created: results.pets_created,
        skipped: results.skipped,
        errors: results.errors
      }
    })

  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to provide migration template/examples
export async function GET() {
  const csvTemplate = `name,email,phone,address,pet_name,pet_breed,pet_age,pet_notes
John Smith,john@example.com,555-0123,"123 Main St, City, State",Buddy,Golden Retriever,5,Friendly dog
Jane Doe,jane@example.com,555-0456,"456 Oak Ave, City, State",Mittens,Persian Cat,3,Indoor cat only
Bob Johnson,bob@example.com,555-0789,"789 Pine Rd, City, State",Max,German Shepherd,7,Needs gentle handling`

  return new NextResponse(csvTemplate, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="barkbook_import_template.csv"'
    }
  })
}
