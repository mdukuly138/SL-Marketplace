import { supabase } from '@/lib/supabase'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at,
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapMessage)
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select('id, conversation_id, sender_id, content, created_at')
    .single()

  if (error) throw error

  await supabase
    .from('conversations')
    .update({ last_message: content, last_message_at: new Date().toISOString() })
    .eq('id', conversationId)

  return mapMessage(data)
}

export async function markConversationRead(conversationId: string, userId: string, isBuyer: boolean) {
  const field = isBuyer ? 'last_read_buyer_at' : 'last_read_seller_at'
  await supabase.from('conversations').update({ [field]: new Date().toISOString() }).eq('id', conversationId)
    }
