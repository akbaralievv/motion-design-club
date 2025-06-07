'use client';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ContactPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('price') || input.includes('cost')) {
      return 'Our courses range from $49 to $199. You can find detailed pricing on each course page.';
    }

    if (input.includes('refund') || input.includes('money back')) {
      return "We offer a 30-day money-back guarantee if you're not satisfied with the course.";
    }

    if (input.includes('duration') || input.includes('length')) {
      return 'Course durations vary from 4 to 12 weeks, depending on the complexity and content.';
    }

    if (input.includes('certificate')) {
      return "Yes, you'll receive a certificate of completion after finishing the course.";
    }

    if (input.includes('support') || input.includes('help')) {
      return 'We provide 24/7 support through our help center and email support@motiondesignclub.com';
    }

    if (input.includes('prerequisite') || input.includes('requirement')) {
      return 'Most courses require basic computer skills. Some advanced courses may require prior experience with design software.';
    }

    return "I'm here to help! Could you please provide more details about your question?";
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Have questions? Our AI assistant is here to help!
            </p>
          </div>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="chat">Chat with AI</TabsTrigger>
              <TabsTrigger value="support">Technical Support</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="h-[600px] flex flex-col">
                  {/* Chat messages */}
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                    style={{
                      scrollBehavior: 'smooth',
                      maxHeight: 'calc(600px - 80px)', // Высота контейнера минус высота формы ввода
                    }}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                        <div
                          className={`flex items-start gap-3 max-w-[80%] ${
                            message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                message.sender === 'user'
                                  ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
                                  : 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot'
                              }
                              alt={message.sender}
                            />
                            <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-4 ${
                              message.sender === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}>
                            <p>{message.text}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="https://api.dicebear.com/7.x/avataaars/svg?seed=bot"
                              alt="bot"
                            />
                            <AvatarFallback>B</AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg p-4">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSubmit} className="p-4 border-t">
                    <div className="flex gap-4">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!input.trim()}>
                        Send
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="support">
              <div className="bg-card rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Contact Technical Support</h2>

                <div className="grid gap-8 md:grid-cols-2">
                  {/* Email Support */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-sm text-muted-foreground">
                          support@motiondesignclub.com
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:support@motiondesignclub.com">Send Email</a>
                    </Button>
                  </div>

                  {/* WhatsApp Support */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">WhatsApp</h3>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>

                  {/* Telegram Support */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary">
                          <path d="M21.5 2L2 11l7 3.5L17 7l-5 15 3.5-7L22 9.5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Telegram</h3>
                        <p className="text-sm text-muted-foreground">@motiondesignclub</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href="https://t.me/motiondesignclub"
                        target="_blank"
                        rel="noopener noreferrer">
                        Chat on Telegram
                      </a>
                    </Button>
                  </div>

                  {/* Working Hours */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Working Hours</h3>
                        <p className="text-sm text-muted-foreground">24/7 Support Available</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Response time: within 1 hour</p>
                      <p>Average resolution time: 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
