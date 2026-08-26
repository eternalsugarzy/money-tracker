import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  // Graceful fallback
}

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
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
  } catch (err) {
    // In Expo Go or restricted dev environment, return false quietly
    return false;
  }
}

export async function scheduleDailyExpenseReminder(
  hour: number = 20,
  minute: number = 0,
  enabled: boolean = true
): Promise<void> {
  try {
    // Cancel existing daily reminders first
    await cancelDailyExpenseReminder();

    if (!enabled) return;

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      identifier: 'daily_expense_reminder',
      content: {
        title: '💰 Jangan lupa catat keuanganmu!',
        body: 'Sudah ada pengeluaran atau pemasukan hari ini? Yuk luangkan 1 menit untuk mencatat di SuFiKer+.',
        sound: true,
        data: { screen: 'AddModal' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats: true,
      } as any,
    });
  } catch (err) {
    // Non-blocking silent fallback for notification scheduling
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
        body: `Waktunya mencatat ${type === 'income' ? 'pemasukan' : 'pengeluaran'} "${itemName}" sebesar ${formattedAmount}. Buka SuFiKer+ untuk konfirmasi.`,
        sound: true,
      },
      trigger: null, // send immediately
    });
  } catch (err) {
    // Non-blocking silent fallback
  }
}
