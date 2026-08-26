import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { NeoModal } from './NeoModal';
import { NeoButton } from './NeoButton';

interface NeoDatePickerProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const NeoDatePicker: React.FC<NeoDatePickerProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}) => {
  const { theme } = useTheme();

  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(initialDate.getDate());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleConfirm = () => {
    const yStr = currentYear.toString();
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(selectedDay).padStart(2, '0');
    onSelectDate(`${yStr}-${mStr}-${dStr}`);
    onClose();
  };

  const handleSetToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  return (
    <NeoModal
      visible={visible}
      onClose={onClose}
      title="PILIH TANGGAL"
      subtitle="Atur tanggal transaksi"
    >
      <View style={styles.container}>
        {/* Month & Year Navigation Header */}
        <View
          style={[
            styles.navHeader,
            {
              backgroundColor: theme.colors.cardSecondary,
              borderColor: theme.colors.border,
              borderWidth: 2,
            },
          ]}
        >
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.navTitle, { color: theme.colors.text }]}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Day Name Labels */}
        <View style={styles.dayNamesRow}>
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
            <Text
              key={d}
              style={[
                styles.dayNameText,
                { color: i === 0 ? theme.colors.expense : theme.colors.textMuted },
              ]}
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.calendarGrid}>
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <View key={`empty_${idx}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected = dayNum === selectedDay;

            return (
              <TouchableOpacity
                key={`day_${dayNum}`}
                onPress={() => setSelectedDay(dayNum)}
                style={[
                  styles.dayCell,
                  isSelected && [
                    styles.selectedDayCell,
                    {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.border,
                      borderWidth: 2,
                    },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    {
                      color: isSelected ? '#121212' : theme.colors.text,
                      fontWeight: isSelected ? '900' : '600',
                    },
                  ]}
                >
                  {dayNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={handleSetToday}
            style={[
              styles.todayBtn,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <Text style={[styles.todayText, { color: theme.colors.text }]}>Hari Ini</Text>
          </TouchableOpacity>

          <NeoButton
            title="PILIH TANGGAL INI"
            variant="primary"
            onPress={handleConfirm}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </View>
    </NeoModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  navBtn: {
    padding: 6,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayNameText: {
    fontSize: 12,
    fontWeight: '800',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedDayCell: {
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  todayBtn: {
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
  },
  todayText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
