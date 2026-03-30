export const users = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/764529/pexels-photo-764529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'online'
  },
  {
    id: 'user-2',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'online'
  },
  {
    id: 'user-3',
    name: 'James Wilson',
    email: 'james@example.com',
    avatar: 'https://images.pexels.com/photos/2444708/pexels-photo-2444708.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'offline'
  },
  {
    id: 'user-5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'online'
  },
  {
    id: 'user-6',
    name: 'Olivia Taylor',
    email: 'olivia@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'online'
  },
  {
    id: 'user-7',
    name: 'David Martinez',
    email: 'david@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150&w=150',
    status: 'offline'
  }
];

export const groups = [
  {
    id: 'group-1',
    name: 'Design Team',
    avatar: null,
    members: ['user-1', 'user-2', 'user-3', 'user-5'],
    isGroup: true
  },
  {
    id: 'group-2',
    name: 'Project Alpha',
    avatar: null,
    members: ['user-1', 'user-4', 'user-6', 'user-7'],
    isGroup: true
  },
  {
    id: 'group-3',
    name: 'Weekend Plans',
    avatar: null,
    members: ['user-1', 'user-2', 'user-5'],
    isGroup: true
  }
];

export const initialChats = [
  {
    id: 'chat-1',
    participants: ['user-1', 'user-2'],
    isGroup: false,
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unreadCount: 2
  },
  {
    id: 'chat-2',
    participants: ['user-1', 'user-3'],
    isGroup: false,
    lastMessage: 'The meeting is scheduled for tomorrow.',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'chat-3',
    participants: ['user-1', 'user-4'],
    isGroup: false,
    lastMessage: 'Thanks for sending the files!',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'chat-4',
    participants: ['user-1', 'user-5'],
    isGroup: false,
    lastMessage: 'Let me check and get back to you.',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1
  },
  {
    id: 'chat-5',
    participants: ['user-1', 'user-6'],
    isGroup: false,
    lastMessage: 'Great work on the presentation!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'group-chat-1',
    groupId: 'group-1',
    participants: ['user-1', 'user-2', 'user-3', 'user-5'],
    isGroup: true,
    lastMessage: 'Sarah: The new designs look amazing!',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unreadCount: 5
  },
  {
    id: 'group-chat-2',
    groupId: 'group-2',
    participants: ['user-1', 'user-4', 'user-6', 'user-7'],
    isGroup: true,
    lastMessage: 'Emma: Deadline extended to Friday.',
    lastMessageTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unreadCount: 0
  },
  {
    id: 'group-chat-3',
    groupId: 'group-3',
    participants: ['user-1', 'user-2', 'user-5'],
    isGroup: true,
    lastMessage: 'Michael: Sounds like a plan!',
    lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0
  }
];

export const initialMessages = {
  'chat-1': [
    {
      id: 'msg-1-1',
      senderId: 'user-2',
      content: 'Hey Alex! Are you free for a quick call?',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-1-2',
      senderId: 'user-1',
      content: 'Sure! Give me 5 minutes.',
      timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-1-3',
      senderId: 'user-2',
      content: 'Perfect! I wanted to discuss the new project requirements.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-1-4',
      senderId: 'user-1',
      content: 'Sounds good. Let me pull up the documents.',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-1-5',
      senderId: 'user-2',
      content: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'delivered',
      type: 'text'
    }
  ],
  'chat-2': [
    {
      id: 'msg-2-1',
      senderId: 'user-3',
      content: 'Hi Alex, wanted to sync about the Q4 goals.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-2-2',
      senderId: 'user-1',
      content: 'Of course! When works best for you?',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-2-3',
      senderId: 'user-3',
      content: 'The meeting is scheduled for tomorrow.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'chat-3': [
    {
      id: 'msg-3-1',
      senderId: 'user-1',
      content: 'Here are the design files you requested.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-3-2',
      senderId: 'user-1',
      content: '',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'file',
      file: {
        name: 'Design_Specs.pdf',
        type: 'pdf',
        size: '2.4 MB',
        url: '#'
      }
    },
    {
      id: 'msg-3-3',
      senderId: 'user-4',
      content: 'Thanks for sending the files!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'chat-4': [
    {
      id: 'msg-4-1',
      senderId: 'user-5',
      content: 'Did you get a chance to review the proposal?',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-4-2',
      senderId: 'user-1',
      content: 'Let me check and get back to you.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'delivered',
      type: 'text'
    }
  ],
  'chat-5': [
    {
      id: 'msg-5-1',
      senderId: 'user-1',
      content: 'The presentation went really well!',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-5-2',
      senderId: 'user-1',
      content: '',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'image',
      file: {
        name: 'presentation_screenshot.png',
        type: 'image',
        url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    },
    {
      id: 'msg-5-3',
      senderId: 'user-6',
      content: 'Great work on the presentation!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'group-chat-1': [
    {
      id: 'msg-g1-1',
      senderId: 'user-3',
      content: 'Team, please review the updated mockups.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g1-2',
      senderId: 'user-5',
      content: 'Looking at them now!',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g1-3',
      senderId: 'user-1',
      content: 'Great work everyone. A few minor tweaks needed.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g1-4',
      senderId: 'user-2',
      content: 'The new designs look amazing!',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'delivered',
      type: 'text'
    }
  ],
  'group-chat-2': [
    {
      id: 'msg-g2-1',
      senderId: 'user-7',
      content: 'Any updates on the deliverables?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g2-2',
      senderId: 'user-1',
      content: 'Working on the final touches.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g2-3',
      senderId: 'user-4',
      content: 'Deadline extended to Friday.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    }
  ],
  'group-chat-3': [
    {
      id: 'msg-g3-1',
      senderId: 'user-2',
      content: 'Anyone up for hiking this weekend?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g3-2',
      senderId: 'user-1',
      content: 'Count me in! What time?',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-g3-3',
      senderId: 'user-5',
      content: 'Sounds like a plan!',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      type: 'text'
    }
  ]
};

export const getUserById = (id) => users.find(u => u.id === id);
export const getGroupById = (id) => groups.find(g => g.id === id);
