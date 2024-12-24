import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { useMessages } from "./hooks/useMessages";
import { useNotifications } from "./hooks/useNotifications";
import { useSendMessage } from "./hooks/useSendMessage";

const Messages = () => {
  const [newMessage, setNewMessage] = useState("");
  const { data: messages = [], isError: isMessagesError } = useMessages();
  const { data: notifications = [], isError: isNotificationsError } = useNotifications();
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage, {
      onSuccess: () => setNewMessage(""),
    });
  };

  if (isMessagesError || isNotificationsError) {
    return (
      <div className="p-4">
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">Error loading data. Please try again later.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Messages & Notifications</h1>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Support
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="h-[400px] overflow-y-auto space-y-4 p-4 border rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">
                No messages yet. Start a conversation with support.
              </div>
            ) : (
              messages.map((message) => (
                <Card key={message.id} className={`p-3 ${message.is_admin ? 'ml-8 bg-blue-50' : 'mr-8'}`}>
                  <p className="text-sm text-gray-600">{message.is_admin ? 'Support' : 'You'}</p>
                  <p>{message.content}</p>
                </Card>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any notifications at the moment
              </p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className="p-4">
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-gray-600">{notification.message}</p>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;