import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { TransactionsScreen } from '../screens/transactions/TransactionsScreen';
import { BudgetScreen } from '../screens/budget/BudgetScreen';
import { MoreScreen } from '../screens/more/MoreScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator<RootTabParamList>();

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // iPhone 16 bottom safe area is 34pt
  const bottomPadding = insets.bottom > 0 ? insets.bottom : Platform.OS === 'ios' ? 24 : 10;
  const barHeight = 56 + bottomPadding;

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: barHeight,
          paddingBottom: bottomPadding,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: theme.neo.borderWidth,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Middle Center FAB Button (➕ Tambah) - iPhone 16 tuned
        if (route.name === 'AddPlaceholder') {
          return (
            <View key={route.key} style={styles.fabWrapper}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('AddModal')}
                style={[
                  styles.fabButton,
                  {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.border,
                    borderWidth: theme.neo.borderWidthThick,
                    shadowColor: theme.neo.shadow.shadowColor,
                    shadowOffset: { width: 3.5, height: 3.5 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    elevation: 8,
                  },
                ]}
              >
                <Ionicons name="add" size={34} color="#121212" />
              </TouchableOpacity>
              <Text style={[styles.fabLabel, { color: theme.colors.text }]}>Tambah</Text>
            </View>
          );
        }

        const getIconName = (routeName: string, focused: boolean) => {
          switch (routeName) {
            case 'HomeTab':
              return focused ? 'home' : 'home-outline';
            case 'TransactionsTab':
              return focused ? 'list' : 'list-outline';
            case 'BudgetTab':
              return focused ? 'pie-chart' : 'pie-chart-outline';
            case 'MoreTab':
            default:
              return focused ? 'grid' : 'grid-outline';
          }
        };

        const getTabLabel = (routeName: string) => {
          switch (routeName) {
            case 'HomeTab':
              return 'Home';
            case 'TransactionsTab':
              return 'Transaksi';
            case 'BudgetTab':
              return 'Budget';
            case 'MoreTab':
            default:
              return 'Lainnya';
          }
        };

        const iconName = getIconName(route.name, isFocused);
        const label = getTabLabel(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={[
              styles.tabItem,
              isFocused && [
                styles.tabItemActive,
                {
                  backgroundColor: theme.colors.cardSecondary,
                  borderColor: theme.colors.border,
                  borderWidth: 1.5,
                },
              ],
            ]}
          >
            <Ionicons
              name={iconName as any}
              size={23}
              color={isFocused ? theme.colors.text : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? theme.colors.text : theme.colors.textMuted,
                  fontWeight: isFocused ? '900' : '600',
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const EmptyComponent = () => null;

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="TransactionsTab" component={TransactionsScreen} />
      <Tab.Screen name="AddPlaceholder" component={EmptyComponent} />
      <Tab.Screen name="BudgetTab" component={BudgetScreen} />
      <Tab.Screen name="MoreTab" component={MoreScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 2,
    minHeight: 44, // Apple HIG min touch target
  },
  tabItemActive: {
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -34,
    zIndex: 10,
    width: 68,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
  },
});
