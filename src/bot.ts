import TelegramBot from "node-telegram-bot-api";
import nodeCron from "node-cron";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token!, { polling: true });
const daysWeek = [
  "Понедельник",
  "Вторник",
  "Среду",
  "Четверг",
  "Пятницу",
  "Субботу",
  "Воскресенье",
];

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
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === "/remind") {
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
          return bot.sendMessage(
            chatId,
            "Дата в неверном формате, повторите попытку!"
          );
        }

        setCustomReminder(chatId, item.text, bot);
        return bot.sendMessage(
          chatId,
          `Напоминание установлено на ${hour} часов каждый день в ${
            daysWeek[Number(day)]
          }.`
        );
      } else
        return bot.sendMessage(
          chatId,
          "Дата в неверном формате, повторите попытку!"
        );
    });
  }
});

// Напоминание каждый вторник
function scheduleReminder(chatId: number, bot: TelegramBot) {
  nodeCron.schedule("0 9 * * 2", () => {
    bot.sendMessage(chatId, "Не забудь проверить счёт!");
  });
}

// Установка пользовательского напоминания
function setCustomReminder(chatId: number, time: string, bot: TelegramBot) {
  const [hour, day] = time.split(":");
  nodeCron.schedule(`0 ${hour} * * ${day}`, () => {
    bot.sendMessage(chatId, "Пора проверить счёт!");
  });
}
