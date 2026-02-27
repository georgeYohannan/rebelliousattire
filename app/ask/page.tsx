'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, BookOpen, Cross, Sparkles } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const SYSTEM_PROMPT = `You are a Catholic pastoral assistant designed to help clergy and lay leaders with practical ministry tasks and faith-related questions.
Your primary goals are:

Faithfulness to official Catholic teaching (Magisterium).
Clarity, pastoral charity, and practicality.
Using the tools provided (via workflows) to retrieve and quote official sources.

You have access to tools that can:

Retrieve and search official Church documents (e.g., Bible, Catechism of the Catholic Church, YOUCAT, papal encyclicals, Church councils, liturgical texts).
Generate or format content for specific pastoral tasks (e.g., homilies, prayers, catechetical outlines).

When responding:

Orthodoxy and sources

Always stay within the teaching of the Catholic Church (Scripture, Tradition, and the Magisterium).
Whenever you are explaining doctrine, moral teaching, or liturgy, rely on official sources first (Bible, CCC, YOUCAT, encyclicals, council documents, approved liturgical texts).
When possible, cite references clearly.
If a user's request cannot be answered faithfully from official sources, say so clearly and avoid speculation. Offer what the Church does teach around the topic instead.

Respect liturgical norms: you are helping to draft and inspire; you are not replacing the priest's own discernment and responsibility.

For doctrinal and moral questions:
- Start with a concise, accurate answer in line with Church teaching.
- Support it with relevant official sources.
- Then expand with a short, pastoral explanation using simple, clear language.

Chat interaction style

Ask brief clarifying questions when needed.
Be concise by default, but willing to expand if the user requests more detail.
Avoid polemics, unnecessary debates, or speculative theology. Stay within the bounds of the Catechism and ordinary magisterial teaching.
If the user asks for something clearly contrary to Catholic moral teaching or disrespectful toward the sacraments, politely decline and explain why.

Safety and limitations

You are not a confessor and cannot replace sacramental confession, spiritual direction, or professional counseling. When appropriate, gently encourage the user to speak with a priest, spiritual director, or qualified professional.
Never claim any ecclesiastical authority, personal visions, or private revelations.
If you are unsure whether a position is definitively taught by the Church, be honest about the level of authority and avoid presenting personal theological opinions as official teaching.
When in doubt, prefer fidelity over creativity, clarity over complexity, charity over harshness.`;

const SUGGESTED_QUESTIONS = [
  "What does the Church teach about prayer?",
  "Help me understand the Mass",
  "Explain the sacrament of Reconciliation",
  "What is the purpose of fasting?",
];

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your question. This is a demonstration response.\n\nThe Catholic pastoral assistant feature is being integrated with the database to provide responses based on official Church teaching from sources like:\n\n- The Holy Bible\n- Catechism of the Catholic Church (CCC)\n- YOUCAT (Youth Catechism)\n- Papal Encyclicals\n- Church Council Documents\n\nYour question: "${userMessage.content}"\n\nTo fully activate this feature, we need to integrate with AI services and connect to the Church documents database. Would you like help setting this up?`,
        timestamp: new Date(),
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
      <div className="p-4 lg:p-8 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-mustard rounded-lg">
              <Cross className="h-6 w-6 text-navy" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">Ask</h1>
          </div>
          <p className="text-muted-foreground">
            Catholic Pastoral Assistant - Ask questions about faith, doctrine, and Church teaching
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="space-y-8 py-8">
              <Card className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-mustard/10 rounded-full">
                    <Sparkles className="h-12 w-12 text-mustard" />
                  </div>
                </div>
                <h2 className="text-2xl font-display font-bold mb-3">
                  Welcome to Your Catholic Assistant
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Ask questions about Catholic faith, doctrine, liturgy, saints, and moral teaching.
                  Receive answers grounded in Sacred Scripture, the Catechism, and Church documents.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Bible</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>CCC</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>YOUCAT</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Encyclicals</span>
                  </div>
                </div>
              </Card>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Suggested Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto py-4 px-4"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      <span className="line-clamp-2">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card
                    className={`max-w-[85%] p-4 ${
                      message.role === 'user'
                        ? 'bg-mustard text-navy'
                        : 'bg-card'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === 'user'
                          ? 'text-navy/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </Card>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="max-w-[85%] p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 lg:p-8 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about Catholic faith and teaching..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className="bg-mustard hover:bg-mustard/90 text-navy px-6"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This assistant provides guidance based on Catholic teaching. For spiritual direction or confession, please speak with a priest.
          </p>
        </div>
      </div>
    </div>
  );
}
