import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFE600',
    });
  }

  return true;
}

export async function scheduleDailyExpenseReminder(
  hour: number = 20,
  minute: number = 0,
  enabled: boolean = true
): Promise<void> {
  try {
    // Cancel existing daily reminders
    await cancelDailyExpenseReminder();

    if (!enabled) return;

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      identifier: 'daily_expense_reminder',
      content: {
        title: '💰 Jangan lupa catat keuanganmu!',
        body: 'Sudah ada pengeluaran atau pemasukan hari ini? Yuk luangkan 1 menit untuk mencatat di Money+.',
        sound: true,
        data: { screen: 'Add' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (err) {
    console.warn('Failed to schedule daily reminder:', err);
  }
}

export async function cancelDailyExpenseReminder(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync('daily_expense_reminder');
  } catch (err) {
    // ignore
  }
}

export async function sendRecurringDueNotification(
  itemName: string,
  amount: number,
  type: string
): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const formattedAmount = `Rp ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ Pengingat Transaksi Berulang`,
        body: `Waktunya mencatat ${type === 'income' ? 'pemasukan' : 'pengeluaran'} "${itemName}" sebesar ${formattedAmount}. Buka aplikasi untuk konfirmasi.`,
        sound: true,
      },
      trigger: null, // send immediately
    });
  } catch (err) {
    console.warn('Failed to send recurring notification:', err);
  }
}
