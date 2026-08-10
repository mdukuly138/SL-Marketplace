import { supabase } from '@/lib/supabase'

async function convertHeicIfNeeded(file: File): Promise<File> {
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' || /\.heic$|\.heif$/i.test(file.name)
  if (!isHeic) return file

  const heic2any = (await import('heic2any')).default
  const convertedBlob = (await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 })) as Blob
  const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg')
  return new File([convertedBlob], newName, { type: 'image/jpeg' })
}

export async function uploadListingImages(files: File[], userId: string): Promise<string[]> {
  const urls: string[] = []

  for (const rawFile of files) {
    const file = await convertHeicIfNeeded(rawFile)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from('listings').upload(path, file)
    if (error) throw error

    const { data } = supabase.storage.from('listings').getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return urls
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const converted = await convertHeicIfNeeded(file)
  const ext = converted.name.split('.').pop()
  const path = `${userId}/avatar-${Date.now()}.${ext}`

  const { error } = await supabase.storage.from('avatars').upload(path, converted, { upsert: true })
  if (error) throw error

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadPostMedia(file: File, userId: string, mediaType: 'image' | 'video'): Promise<string> {
  const processedFile = mediaType === 'image' ? await convertHeicIfNeeded(file) : file
  const ext = processedFile.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('posts').upload(path, processedFile)
  if (error) throw error

  const { data } = supabase.storage.from('posts').getPublicUrl(path)
  return data.publicUrl
    }
