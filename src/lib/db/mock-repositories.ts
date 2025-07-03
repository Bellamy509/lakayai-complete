// Repositories mockés pour fonctionner sans base de données
import {
  ChatRepository,
  ChatThread,
  ChatMessage,
  Project,
} from "app-types/chat";
import { UserRepository, User, UserPreferences } from "app-types/user";
import { generateUUID } from "lib/utils";

// Storage en mémoire
const mockData = {
  threads: new Map<string, ChatThread & { messages: ChatMessage[] }>(),
  projects: new Map<string, Project>(),
  users: new Map<string, User>(),
  messages: new Map<string, ChatMessage>(),
};

export const mockChatRepository: ChatRepository = {
  insertThread: async (
    thread: Omit<ChatThread, "createdAt">,
  ): Promise<ChatThread> => {
    const newThread: ChatThread = {
      ...thread,
      createdAt: new Date(),
    };
    mockData.threads.set(thread.id, { ...newThread, messages: [] });
    return newThread;
  },

  selectThread: async (id: string): Promise<ChatThread | null> => {
    const thread = mockData.threads.get(id);
    if (!thread) return null;
    const { messages, ...threadData } = thread;
    return threadData;
  },

  deleteChatMessage: async (id: string): Promise<void> => {
    mockData.messages.delete(id);
  },

  selectThreadDetails: async (id: string) => {
    const thread = mockData.threads.get(id);
    if (!thread) return null;

    return {
      id: thread.id,
      title: thread.title,
      userId: thread.userId,
      createdAt: thread.createdAt,
      projectId: thread.projectId,
      instructions: null,
      userPreferences: undefined,
      messages: thread.messages,
    };
  },

  selectThreadInstructions: async (_userId: string, threadId?: string) => {
    return {
      instructions: null,
      userPreferences: undefined,
      threadId,
      projectId: undefined,
    };
  },

  selectThreadInstructionsByProjectId: async (
    _userId: string,
    _projectId?: string,
  ) => {
    return {
      instructions: null,
      userPreferences: undefined,
    };
  },

  selectMessagesByThreadId: async (
    threadId: string,
  ): Promise<ChatMessage[]> => {
    const thread = mockData.threads.get(threadId);
    return thread?.messages || [];
  },

  selectThreadsByUserId: async (
    userId: string,
  ): Promise<(ChatThread & { lastMessageAt: number })[]> => {
    const userThreads = Array.from(mockData.threads.values())
      .filter((thread) => thread.userId === userId)
      .map((thread) => ({
        id: thread.id,
        title: thread.title,
        userId: thread.userId,
        createdAt: thread.createdAt,
        projectId: thread.projectId,
        lastMessageAt:
          thread.messages.length > 0
            ? Math.max(...thread.messages.map((m) => m.createdAt.getTime()))
            : thread.createdAt.getTime(),
      }));

    return userThreads.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },

  updateThread: async (
    id: string,
    thread: Partial<Omit<ChatThread, "id" | "createdAt">>,
  ): Promise<ChatThread> => {
    const existing = mockData.threads.get(id);
    if (!existing) throw new Error("Thread not found");

    const updated = { ...existing, ...thread };
    mockData.threads.set(id, updated);
    const { messages, ...threadData } = updated;
    return threadData;
  },

  deleteThread: async (id: string): Promise<void> => {
    mockData.threads.delete(id);
  },

  insertMessage: async (
    message: Omit<ChatMessage, "createdAt">,
  ): Promise<ChatMessage> => {
    const newMessage: ChatMessage = {
      ...message,
      createdAt: new Date(),
    };
    mockData.messages.set(message.id, newMessage);

    // Ajouter à la thread
    const thread = mockData.threads.get(message.threadId);
    if (thread) {
      thread.messages.push(newMessage);
    }

    return newMessage;
  },

  upsertMessage: async (
    message: Omit<ChatMessage, "createdAt">,
  ): Promise<ChatMessage> => {
    const existing = mockData.messages.get(message.id);
    const newMessage: ChatMessage = {
      ...message,
      createdAt: existing?.createdAt || new Date(),
    };
    mockData.messages.set(message.id, newMessage);

    // Mettre à jour dans la thread
    const thread = mockData.threads.get(message.threadId);
    if (thread) {
      const index = thread.messages.findIndex((m) => m.id === message.id);
      if (index >= 0) {
        thread.messages[index] = newMessage;
      } else {
        thread.messages.push(newMessage);
      }
    }

    return newMessage;
  },

  deleteMessagesByChatIdAfterTimestamp: async (
    messageId: string,
  ): Promise<void> => {
    const message = mockData.messages.get(messageId);
    if (!message) return;

    const thread = mockData.threads.get(message.threadId);
    if (thread) {
      thread.messages = thread.messages.filter(
        (m) => m.createdAt < message.createdAt,
      );
    }
  },

  deleteNonProjectThreads: async (userId: string): Promise<void> => {
    for (const [id, thread] of mockData.threads.entries()) {
      if (thread.userId === userId && !thread.projectId) {
        mockData.threads.delete(id);
      }
    }
  },

  deleteAllThreads: async (userId: string): Promise<void> => {
    for (const [id, thread] of mockData.threads.entries()) {
      if (thread.userId === userId) {
        mockData.threads.delete(id);
      }
    }
  },

  insertProject: async (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project> => {
    const newProject: Project = {
      ...project,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockData.projects.set(newProject.id, newProject);
    return newProject;
  },

  selectProjectById: async (
    id: string,
  ): Promise<(Project & { threads: ChatThread[] }) | null> => {
    const project = mockData.projects.get(id);
    if (!project) return null;

    const threads = Array.from(mockData.threads.values())
      .filter((thread) => thread.projectId === id)
      .map((thread) => {
        const { messages, ...threadData } = thread;
        return threadData;
      });

    return { ...project, threads };
  },

  selectProjectsByUserId: async (
    userId: string,
  ): Promise<Omit<Project, "instructions">[]> => {
    return Array.from(mockData.projects.values())
      .filter((project) => project.userId === userId)
      .map(({ instructions, ...project }) => project);
  },

  updateProject: async (
    id: string,
    project: Partial<Pick<Project, "name" | "instructions">>,
  ): Promise<Project> => {
    const existing = mockData.projects.get(id);
    if (!existing) throw new Error("Project not found");

    const updated = { ...existing, ...project, updatedAt: new Date() };
    mockData.projects.set(id, updated);
    return updated;
  },

  deleteProject: async (id: string): Promise<void> => {
    mockData.projects.delete(id);
    // Supprimer les threads associés
    for (const [threadId, thread] of mockData.threads.entries()) {
      if (thread.projectId === id) {
        mockData.threads.delete(threadId);
      }
    }
  },

  insertMessages: async (
    messages: Array<Omit<ChatMessage, "createdAt"> & { createdAt?: Date }>,
  ): Promise<ChatMessage[]> => {
    const results: ChatMessage[] = [];
    for (const message of messages) {
      const newMessage: ChatMessage = {
        ...message,
        createdAt: message.createdAt || new Date(),
      };
      mockData.messages.set(newMessage.id, newMessage);

      // Ajouter à la thread
      const thread = mockData.threads.get(newMessage.threadId);
      if (thread) {
        thread.messages.push(newMessage);
      }

      results.push(newMessage);
    }
    return results;
  },
};

export const mockUserRepository: UserRepository = {
  existsByEmail: async (email: string): Promise<boolean> => {
    return Array.from(mockData.users.values()).some(
      (user) => user.email === email,
    );
  },

  updateUser: async (
    id: string,
    user: Pick<User, "name" | "image">,
  ): Promise<User> => {
    const existing = mockData.users.get(id);
    if (!existing) throw new Error("User not found");

    const updated = { ...existing, ...user };
    mockData.users.set(id, updated);
    return updated;
  },

  updatePreferences: async (
    userId: string,
    preferences: UserPreferences,
  ): Promise<User> => {
    const existing = mockData.users.get(userId);
    if (!existing) throw new Error("User not found");

    const updated = { ...existing, preferences };
    mockData.users.set(userId, updated);
    return updated;
  },

  getPreferences: async (userId: string): Promise<UserPreferences | null> => {
    const user = mockData.users.get(userId);
    return user?.preferences || null;
  },

  findById: async (userId: string): Promise<User | null> => {
    return mockData.users.get(userId) || null;
  },
};
