import TelegramBot from 'node-telegram-bot-api';
import nodeCron from 'node-cron';

// Напоминание каждый вторник
export function scheduleReminder(chatId: number, bot: TelegramBot) {
  nodeCron.schedule('0 9 * * 2', () => {
    bot.sendMessage(chatId, 'Не забудь проверить счёт!');
  });
}

// Установка пользовательского напоминания
export function setCustomReminder(chatId: number, time: string, bot: TelegramBot) {
  const [hour, day] = time.split(':');
  nodeCron.schedule(`0 ${hour} * * ${day}`, () => {
    bot.sendMessage(chatId, 'Пора проверить счёт!');
  });
}