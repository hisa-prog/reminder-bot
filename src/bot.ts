import TelegramBot from "node-telegram-bot-api";
import { scheduleReminder, setCustomReminder } from "./reminders";

const token = "7881860290:AAErw7n9nApbIQtt-RfwjERf6RfOwov4Se8";
const bot = new TelegramBot(token, { polling: true });
const daysWeek = [
    'Понедельник',
    'Вторник',
    'Среду',
    'Четверг',
    'Пятницу',
    'Субботу',
    'Воскресенье'
]

bot.setMyCommands([
    { command: "/start", description: "Приветствие и начало напоминаний" },
    { command: "/remind", description: "Установить напоминание на каждый день" },
  ]);

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Привет! Я буду напоминать тебе проверять счёт каждый вторник. Используй /remind чтобы установить напоминание на каждый день"
  );

  // Напоминание каждый вторник
  scheduleReminder(chatId, bot);
});

// Установка напоминания
bot.onText(/\/remind (.+)/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    'Пожалуйста введите дату и время в формате "час:день недели"!)'
  );
  bot.on("message", (item) => {
    if (item.text) {
      const [hour, day] = item.text.split(":");

      if (
        Number(hour) < 1 ||
        Number(hour) > 24 ||
        Number(day) < 1 ||
        Number(day) > 7
      ) {
        return bot.sendMessage(chatId, "Дата в неверном формате, повторите попытку!");
      }

      setCustomReminder(chatId, item.text, bot)
      return bot.sendMessage(chatId, `Напоминание установлено на ${hour} часов каждый ${daysWeek[Number(day)]}.`);
    } else return bot.sendMessage(chatId, "Дата в неверном формате, повторите попытку!");
  });
});
