
import { parse } from 'url';
import next from 'next';
import { translateText } from "@/services/translate";
import { users, messages } from '@/db';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer } from 'http';


const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server);

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async (messageData: MessageData) => {
      const { senderId, receiverId, content } = messageData;

      try {
        const receiver = await users.findUnique({
          where: { id: receiverId }
        });

        const sender = await users.findUnique({
            where: { id: senderId }
        });

        if (!sender) {
          throw new Error('Sender not found');
        }

        if (!receiver) {
          throw new Error('Receiver not found');
        }

        const translatedContent = await translateText(content, sender.language, receiver.language);

        const message = await messages.create({
          data: { senderId, receiverId, content, translatedContent }
        });

        io.to(receiverId.toString()).emit('receiveMessage', message);
      } catch (error) {
        console.error('Message could not be sent:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});