
const express = require('express');
const { createServer } = require('http');
const { Server: SocketIOServer } = require('socket.io');
const { Socket } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

// @ts-ignore

const TranslateText = async (content, senderLanguage, receiverLanguage) => {
  try {
    const response = await axios.post('http://localhost:8000/translate/text-to-text', {
      text: content,
      src_lang: senderLanguage,
      tgt_lang: receiverLanguage,
    });

    return response.data.translated_text;

  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}
 
// @ts-ignore
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
// @ts-ignore
  socket.on('sendMessage', async (messageData) => {
    const { senderId, receiverId, content } = messageData;

    try {
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId }
      });

      const sender = await prisma.user.findUnique({
        where: { id: senderId }
      });

      if (!sender) {
        throw new Error('Sender not found');
      }

      if (!receiver) {
        throw new Error('Receiver not found');
      }

      const translatedContent = await TranslateText(content, sender.language, receiver.language);

      const message = await prisma.message.create({
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

httpServer.listen(3001, () => {
  console.log('Socket server running on http://localhost:3001');
});
//we will try next server instead


