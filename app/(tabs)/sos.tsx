import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Button, Badge, Chip } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { FirestoreService } from '../../services/firestoreService';
import { SOSAlert } from '../../types';
import { TriangleAlert as AlertTriangle, MapPin, Clock } from 'lucide-react-native';

export default function SOSScreen() {
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = FirestoreService.subscribeToSOSAlerts((alerts) => {
      setSosAlerts(alerts);
    });

    return unsubscribe;
  }, [user]);

  const handleRespondToSOS = async (alertId: string) => {
    if (!user) return;
    
    Alert.alert(
      'Respond to SOS',
      'Are you sure you want to respond to this emergency?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: "I'm Nearby/Helping",
          onPress: async () => {
            try {
              await FirestoreService.respondToSOS(alertId, user.uid);
            } catch (error) {
              console.error('Error responding to SOS:', error);
              Alert.alert('Error', 'Failed to respond to SOS');
            }
          }
        }
      ]
    );
  };

  const handleResolveSOS = async (alertId: string) => {
    Alert.alert(
      'Resolve SOS',
      'Mark this emergency as resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          onPress: async () => {
            try {
              await FirestoreService.resolveSOS(alertId);
            } catch (error) {
              console.error('Error resolving SOS:', error);
              Alert.alert('Error', 'Failed to resolve SOS');
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#f44336';
      case 'responding': return '#ff9800';
      default: return '#4caf50';
    }
  };

  const renderSOSAlert = ({ item }: { item: SOSAlert }) => (
    <Card style={[styles.alertCard, { borderLeftColor: getStatusColor(item.status) }]}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.alertInfo}>
            <View style={styles.emergencyHeader}>
              <AlertTriangle size={20} color="#f44336" />
              <Text style={styles.emergencyText}>EMERGENCY</Text>
            </View>
            <Text style={styles.touristName}>{item.touristName}</Text>
          </View>
          <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Badge>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={16} color="#f44336" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <Text style={styles.sosMessage}>{item.message}</Text>

        <View style={styles.timeContainer}>
          <Clock size={14} color="#666" />
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {item.status === 'active' && (
            <Button
              mode="contained"
              onPress={() => handleRespondToSOS(item.id)}
              style={styles.respondButton}
              buttonColor="#ff9800"
              icon={() => <AlertTriangle size={16} color="white" />}
            >
              I'm Nearby/Helping
            </Button>
          )}
          
          {item.status === 'responding' && item.respondingGuideId === user?.uid && (
            <Button
              mode="contained"
              onPress={() => handleResolveSOS(item.id)}
              style={styles.resolveButton}
              buttonColor="#4caf50"
            >
              Mark as Resolved
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SOS Alerts</Text>
        <Badge style={styles.countBadge}>{sosAlerts.length}</Badge>
      </View>

      <FlatList
        data={sosAlerts}
        renderItem={renderSOSAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AlertTriangle size={64} color="#ccc" />
            <Text style={styles.emptyText}>No active SOS alerts</Text>
            <Text style={styles.emptySubtext}>Emergency alerts will appear here immediately</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#f44336',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  alertCard: {
    marginBottom: 16,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertInfo: {
    flex: 1,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f44336',
    marginLeft: 4,
  },
  touristName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  sosMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 12,
  },
  actionButtons: {
    marginTop: 8,
  },
  respondButton: {
    marginBottom: 8,
  },
  resolveButton: {
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});