import { supabase } from '@/lib/supabase'

export async function uploadListingImages(files: File[], userId: string): Promise<string[]> {
  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from('listings').upload(path, file)
    if (error) throw error

    const { data } = supabase.storage.from('listings').getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return urls
}
