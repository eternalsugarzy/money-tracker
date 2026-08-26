import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { TransactionDetailScreen } from '../screens/transactions/TransactionDetailScreen';
import { AddTransactionModal } from '../screens/add/AddTransactionModal';
import { BudgetFormModal } from '../screens/budget/BudgetFormModal';
import { AccountsScreen } from '../screens/more/AccountsScreen';
import { AccountFormModal } from '../screens/more/AccountFormModal';
import { CategoriesScreen } from '../screens/more/CategoriesScreen';
import { CategoryFormModal } from '../screens/more/CategoryFormModal';
import { RecurringScreen } from '../screens/more/RecurringScreen';
import { RecurringFormModal } from '../screens/more/RecurringFormModal';
import { DebtsScreen } from '../screens/more/DebtsScreen';
import { DebtFormModal } from '../screens/more/DebtFormModal';
import { ExportReportScreen } from '../screens/more/ExportReportScreen';
import { SettingsScreen } from '../screens/more/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen
        name="AddModal"
        component={AddTransactionModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="BudgetFormModal"
        component={BudgetFormModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="Accounts" component={AccountsScreen} />
      <Stack.Screen
        name="AccountFormModal"
        component={AccountFormModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen
        name="CategoryFormModal"
        component={CategoryFormModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="Recurring" component={RecurringScreen} />
      <Stack.Screen
        name="RecurringFormModal"
        component={RecurringFormModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="Debts" component={DebtsScreen} />
      <Stack.Screen
        name="DebtFormModal"
        component={DebtFormModal}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="ExportReport" component={ExportReportScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
