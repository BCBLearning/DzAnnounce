// deleteUsers.js
import { createClient } from '@supabase/supabase-js'


// 🔁 Remplace par TES VALEURS réelles
const supabaseUrl = 'https://ettkzaqgmmyqidscorzi.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dGt6YXFnbW15cWlkc2NvcnppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEzMzgzNywiZXhwIjoyMDY2NzA5ODM3fQ._b0OgMX5eaQdcfgxtjSTWJCTvczzmCokfNrxjHFxwVo'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function deleteAllUsers() {
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    console.error('❌ Erreur récupération users:', error.message)
    return
  }

  if (!data?.users?.length) {
    console.log('ℹ️ Aucun utilisateur trouvé.')
    return
  }

  for (const user of data.users) {
    console.log(`➡️ Suppression de: ${user.email} (${user.id})`)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    if (deleteError) {
      console.error(`❌ Erreur suppression ${user.email}:`, deleteError.message)
    } else {
      console.log(`✅ Supprimé: ${user.email}`)
    }
  }

  console.log('🎉 Suppression terminée.')
}

deleteAllUsers()