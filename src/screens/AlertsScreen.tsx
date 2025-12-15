import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../contexts/WeatherContext';
import { colors } from '../theme/colors';

export default function AlertsScreen() {
  const { alerts, addAlert, removeAlert } = useWeather();
  const [isEnabled, setIsEnabled] = useState(false);
  const [tempThreshold, setTempThreshold] = useState('30');
  const [condition, setCondition] = useState('above');

  const handleAddAlert = () => {
    if (!tempThreshold || isNaN(Number(tempThreshold))) {
      Alert.alert('Erro', 'Por favor, insira um valor válido para temperatura');
      return;
    }

    addAlert({
      type: 'temp',
      condition: condition as 'above' | 'below',
      value: Number(tempThreshold),
    });

    Alert.alert('Sucesso', 'Alerta configurado com sucesso!');
    setTempThreshold('30');
    setCondition('above');
  };

  return (
    <LinearGradient
      colors={[colors.background, '#1a2c4d']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Alertas</Text>
          <Text style={styles.subtitle}>Configure notificações climáticas</Text>
        </View>

        {/* Alert Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Configurar Novo Alerta</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Tipo de Alerta</Text>
            <View style={styles.conditionButtons}>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  condition === 'above' && styles.conditionButtonActive,
                ]}
                onPress={() => setCondition('above')}
              >
                <Text style={[
                  styles.conditionButtonText,
                  condition === 'above' && styles.conditionButtonTextActive,
                ]}>
                  Acima de
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.conditionButton,
                  condition === 'below' && styles.conditionButtonActive,
                ]}
                onPress={() => setCondition('below')}
              >
                <Text style={[
                  styles.conditionButtonText,
                  condition === 'below' && styles.conditionButtonTextActive,
                ]}>
                  Abaixo de
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Temperatura (°C)</Text>
            <View style={styles.tempInputContainer}>
              <TextInput
                style={styles.tempInput}
                value={tempThreshold}
                onChangeText={setTempThreshold}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={styles.tempUnit}>°C</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddAlert}>
            <Ionicons name="add-circle" size={24} color={colors.text} />
            <Text style={styles.addButtonText}>Adicionar Alerta</Text>
          </TouchableOpacity>
        </View>

        {/* Active Alerts */}
        <View style={styles.alertsContainer}>
          <Text style={styles.sectionTitle}>Alertas Ativos</Text>
          
          {alerts.length === 0 ? (
            <View style={styles.emptyAlerts}>
              <Ionicons name="notifications-off" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyAlertsText}>Nenhum alerta configurado</Text>
            </View>
          ) : (
            alerts.map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  alert.isActive && styles.alertCardActive,
                ]}
              >
                <View style={styles.alertHeader}>
                  <View style={styles.alertType}>
                    <Ionicons
                      name={
                        alert.type === 'temp' ? 'thermometer' :
                        alert.type === 'rain' ? 'rainy' :
                        alert.type === 'wind' ? 'flag' : 'flash'
                      }
                      size={24}
                      color={alert.isActive ? colors.accent : colors.textSecondary}
                    />
                    <View>
                      <Text style={styles.alertTitle}>
                        {alert.type === 'temp' ? 'Temperatura' :
                         alert.type === 'rain' ? 'Chuva' :
                         alert.type === 'wind' ? 'Vento' : 'Tempestade'}
                      </Text>
                      <Text style={styles.alertCondition}>
                        {alert.condition === 'above' ? 'Acima de' : 'Abaixo de'} {alert.value}
                        {alert.type === 'temp' ? '°C' : alert.type === 'wind' ? 'm/s' : '%'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={alert.isActive}
                    onValueChange={() => {
                      if (alert.isActive) {
                        removeAlert(alert.id);
                      }
                    }}
                    trackColor={{ false: colors.textSecondary, true: colors.accent }}
                  />
                </View>
                {alert.isActive && (
                  <Text style={styles.alertActiveText}>
                     Alerta ativo no momento
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Notification Settings */}
        <View style={styles.notificationCard}>
          <View style={styles.notificationHeader}>
            <View>
              <Text style={styles.notificationTitle}>Notificações Push</Text>
              <Text style={styles.notificationSubtitle}>
                Receba alertas importantes
              </Text>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ false: colors.textSecondary, true: colors.primary }}
            />
          </View>
          <Text style={styles.notificationDescription}>
            Ative para receber notificações quando houver alertas climáticos importantes
            na sua região.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  conditionButtons: {
    flexDirection: 'row',
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  conditionButtonActive: {
    backgroundColor: colors.primary,
  },
  conditionButtonText: {
    color: colors.text,
    fontSize: 14,
  },
  conditionButtonTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  tempInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  tempInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 12,
    fontSize: 16,
  },
  tempUnit: {
    color: colors.textSecondary,
    fontSize: 16,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  addButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  alertsContainer: {
    padding: 16,
  },
  emptyAlerts: {
    alignItems: 'center',
    padding: 32,
  },
  emptyAlertsText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
  alertCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  alertCardActive: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  alertCondition: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 12,
    marginTop: 2,
  },
  alertActiveText: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  notificationCard: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  notificationSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  notificationDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});