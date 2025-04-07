import { IUser } from "../models/User";

export function resetDailyUsage(user: IUser) {
  const today = new Date();
  // Si el user no tiene fecha, la inicializamos
  if (!user.lastGenerationDate) {
    user.lastGenerationDate = today;
    user.dailyGenerationCount = 3;
    user.rewardedGenerations = 0;
    return;
  }

  const lastGen = new Date(user.lastGenerationDate);
  const isDifferentDay =
    lastGen.getDate() !== today.getDate() ||
    lastGen.getMonth() !== today.getMonth() ||
    lastGen.getFullYear() !== today.getFullYear();

  if (isDifferentDay) {
    user.lastGenerationDate = today;
    user.dailyGenerationCount = 3; // Resetea a 3
    user.rewardedGenerations = 0; // O, si prefieres, deja la que tenía
  }
}
