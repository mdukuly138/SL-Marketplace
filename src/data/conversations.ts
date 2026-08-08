export interface Conversation {
  id: string
  sellerId: string
  name: string
  avatarUrl?: string
  verified: boolean
  lastMessage: string
  time: string
  unread: number
}

export const conversations: Conversation[] = [
  {
    id: 'c1',
    sellerId: 's6',
    name: 'Freetown Tech Store',
    avatarUrl: 'https://picsum.photos/seed/techstore/200/200',
    verified: true,
    lastMessage: "Yes it's still available — when can you come check it?",
    time: '2h',
    unread: 2,
  },
  {
    id: 'c2',
    sellerId: 's1',
    name: "Aisha's Boutique",
    avatarUrl: 'https://picsum.photos/seed/aisha/200/200',
    verified: true,
    lastMessage: 'Ok, I will have it ready by Friday.',
    time: '1d',
    unread: 0,
  },
  {
    id: 'c3',
    sellerId: 's2',
    name: 'Kamara Motors',
    avatarUrl: 'https://picsum.photos/seed/kamara/200/200',
    verified: true,
    lastMessage: 'Price is negotiable, come and see it first.',
    time: '3d',
    unread: 0,
  },
]
